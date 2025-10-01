import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/users/services/user.service';
import { HashingService } from '../services/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetToken } from '../entities/password-reset-tokens.entity';
import { User } from 'src/users/entities/user.entity';
import { EmailService } from 'src/email/services/email.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import * as bcrypt from 'bcryptjs';
import { BcryptService } from './bcrypt.service';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { Ong } from 'src/ong/entities/ong.entity';

describe('AuthService (integration)', () => {
  let authService: AuthService;
  let userService: UserService;
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    authService = moduleFixture.get<AuthService>(AuthService);
    userService = moduleFixture.get<UserService>(UserService);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  afterEach(async () => {
    await dataSource.getRepository(PasswordResetToken).clear();
    await dataSource.getRepository(User).clear();
    await dataSource.getRepository(Ong).clear();
  });

  describe('login', () => {
    it('deve autenticar usuário válido e retornar access_token', async () => {
      const ongRepo = dataSource.getRepository('Ong');
      const ong = await ongRepo.save({
        razao_social: 'ONG Teste',
        cnpj: '12345678000100',
        email: 'ong@teste.com',
        celular: '11999999999',
        cep: '12345678',
        estado_uf: 'SP',
        cidade: 'São Paulo',
        logradouro: 'Rua Teste',
        bairro: 'Centro',
        numero: '100',
      });

      const senha = '123456';
      const hashed = await bcrypt.hash(senha, 10);
      const user = await userService['userRepository'].save({
        nome: 'Usuário Teste',
        email: 'teste@teste.com',
        cpf: '12345678901',
        celular: '11999999999',
        senha: hashed,
        ativo: true,
        is_admin: true,
        ong,
      });

      const validUser = await authService.validateUser(user.email, senha);
      expect(validUser).toBeDefined();

      const result = await authService.login(validUser);
      expect(result).toHaveProperty('access_token');
    });

    it('deve falhar com senha inválida', async () => {
      const ongRepo = dataSource.getRepository('Ong');
      const ong = await ongRepo.save({
        razao_social: 'ONG Teste',
        cnpj: '12345678000100',
        email: 'ong@teste.com',
        celular: '11999999999',
        cep: '12345678',
        estado_uf: 'SP',
        cidade: 'São Paulo',
        logradouro: 'Rua Teste',
        bairro: 'Centro',
        numero: '100',
      });

      const senha = '123456';
      const hashed = await bcrypt.hash(senha, 10);
      await userService['userRepository'].save({
        nome: 'Usuário Teste',
        email: 'teste@teste.com',
        cpf: '12345678901',
        celular: '11999999999',
        senha: hashed,
        ativo: true,
        is_admin: true,
        ong,
      });

      const result = await authService.validateUser(
        'teste@teste.com',
        'errada',
      );
      expect(result).toBeNull();
    });
  });

  describe('forgot password', () => {
    it('deve gerar token e enviar email', async () => {
      const ongRepo = dataSource.getRepository('Ong');
      const ong = await ongRepo.save({
        razao_social: 'ONG Teste',
        cnpj: '12345678000100',
        email: 'ong@teste.com',
        celular: '11999999999',
        cep: '12345678',
        estado_uf: 'SP',
        cidade: 'São Paulo',
        logradouro: 'Rua Teste',
        bairro: 'Centro',
        numero: '100',
      });

      const senha = '123456';
      const hashed = await bcrypt.hash(senha, 10);
      const user = await userService['userRepository'].save({
        nome: 'Usuário Teste',
        email: 'teste@teste.com',
        cpf: '12345678901',
        celular: '11999999999',
        senha: hashed,
        ativo: true,
        is_admin: true,
        ong,
      });

      await authService.sendLinkForgotPassword(user.email);

      const tokens = await authService['resetTokenRepo'].find();
      expect(tokens).toHaveLength(1);
    });

    it('deve falhar se email não existe', async () => {
      await expect(
        authService.sendLinkForgotPassword('naoexiste@teste.com'),
      ).rejects.toThrow('User not found');
    });
  });

  describe('set password', () => {
    it('deve atualizar senha com token válido', async () => {
      const ongRepo = dataSource.getRepository('Ong');
      const ong = await ongRepo.save({
        razao_social: 'ONG Teste',
        cnpj: '12345678000100',
        email: 'ong@teste.com',
        celular: '11999999999',
        cep: '12345678',
        estado_uf: 'SP',
        cidade: 'São Paulo',
        logradouro: 'Rua Teste',
        bairro: 'Centro',
        numero: '100',
      });
      const senha = '123456';
      const hashed = await bcrypt.hash(senha, 10);
      const user = await userService['userRepository'].save({
        nome: 'Usuário Teste',
        email: 'teste@teste.com',
        cpf: '12345678901',
        celular: '11999999999',
        senha: hashed,
        ativo: true,
        is_admin: true,
        ong,
      });

      const token = 'meutoken';
      const tokenHash = authService['hashToken'](token);

      await authService['resetTokenRepo'].save({
        user,
        tokenHash,
        expires_at: new Date(Date.now() + 1000 * 60 * 60),
      });

      const result = await authService.setPassword(token, 'novaSenha');
      expect(result.message).toBe('Senha definida com sucesso');
    });

    it('deve falhar se token expirado', async () => {
      const ongRepo = dataSource.getRepository('Ong');
      const ong = await ongRepo.save({
        razao_social: 'ONG Teste',
        cnpj: '12345678000100',
        email: 'ong@teste.com',
        celular: '11999999999',
        cep: '12345678',
        estado_uf: 'SP',
        cidade: 'São Paulo',
        logradouro: 'Rua Teste',
        bairro: 'Centro',
        numero: '100',
      });
      const senha = '123456';
      const hashed = await bcrypt.hash(senha, 10);
      const user = await userService['userRepository'].save({
        nome: 'Usuário Teste',
        email: 'teste@teste.com',
        cpf: '12345678901',
        celular: '11999999999',
        senha: hashed,
        ativo: true,
        is_admin: true,
        ong,
      });

      const token = 'meutoken';
      const tokenHash = authService['hashToken'](token);

      await authService['resetTokenRepo'].save({
        user,
        tokenHash,
        expires_at: new Date(Date.now() - 1000),
      });

      await expect(
        authService.setPassword(token, 'novaSenha'),
      ).rejects.toThrow();
    });
  });
});
