import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities/user.entity';
import { PasswordResetToken } from 'src/auth/entities/password-reset-tokens.entity';
import { Ong } from '../entities/ong.entity';

describe('OngService (Integração)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    jest.setTimeout(30000);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterEach(async () => {
    await dataSource.getRepository(PasswordResetToken).clear();
    await dataSource.getRepository(User).clear();
    await dataSource.getRepository(Ong).clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve criar ONG com usuário responsável e token', async () => {
    const createOngDto = {
      razao_social: 'ONG Teste',
      email: 'ongteste@email.com',
      celular: '11999999999',
      cnpj: '12345678000199',
      cep: '01001000',
      estado_uf: 'RS',
      cidade: 'Porto Alegre',
      logradouro: 'Rua Teste',
      bairro: 'Centro',
      numero: '100',
      complemento: 'Sala 1',
      referencia: '',
      responsavel: {
        nome: 'Caroline',
        cpf: '12345678909',
        email: 'caroline@email.com',
        celular: '11988888888',
        is_admin: true,
      },
    };

    const response = await request(app.getHttpServer())
      .post('/ongs')
      .send(createOngDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.razao_social).toBe(createOngDto.razao_social);

    const userRepo = dataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { email: createOngDto.responsavel.email },
      relations: ['ong'],
    });

    expect(user).not.toBeNull();
    expect(user!.ong.id).toBe(response.body.id);

    const tokens = await dataSource.query(
      'SELECT * FROM password_reset_tokens WHERE userId = ?',
      [user!.id],
    );
    expect(tokens.length).toBe(1);
  });

  it('deve lançar ConflictException se e-mail do responsável já existir', async () => {
    const createOngDto = {
      razao_social: 'ONG Teste 2',
      email: 'ongteste2@email.com',
      celular: '11999999999',
      cnpj: '16345678000189',
      cep: '01001000',
      estado_uf: 'RS',
      cidade: 'Santa Rosa',
      logradouro: 'Rua Teste 2',
      bairro: 'Centro',
      numero: '100',
      complemento: 'Sala 1',
      referencia: '',
      responsavel: {
        nome: 'Caroline',
        cpf: '12345678909',
        email: 'caroline@email.com',
        celular: '11988888888',
        is_admin: true,
      },
    };

    await request(app.getHttpServer())
      .post('/ongs')
      .send(createOngDto)
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/ongs')
      .send(createOngDto)
      .expect(409);

    expect(response.body.message).toBe('E-mail do responsável já cadastrado.');
  });
});
