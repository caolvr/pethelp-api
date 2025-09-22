import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailService } from 'src/email/services/email.service';
import { UserService } from 'src/users/services/user.service';
import { LoginDto } from '../dtos/LoginDto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing.service';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetToken } from '../entities/password-reset-tokens.entity';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    @InjectRepository(PasswordResetToken)
    private readonly resetTokenRepo: Repository<PasswordResetToken>,
    private readonly emailService: EmailService,
  ) {}

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findEmail(email);
    if (user) {
    }
  }

  async validateUser(email: string, senha: string): Promise<any> {
    const user = await this.userService.findOne(email);
    let passwordIsValid = false;

    if (user) {
      passwordIsValid = await this.hashingService.compare(senha, user.senha);
      console.log(passwordIsValid);

      if (passwordIsValid) {
        const { senha, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      ongId: user.ong.id,
      isAdmin: user.is_admin,
    };
    console.log(payload);
    return {
      access_token: await this.jwtService.signAsync(payload, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.expiresIn,
      }),
    };
  }

  async setPassword(token: string, senha: string) {
    const tokenHash = this.hashToken(token);

    const prt = await this.resetTokenRepo.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    const now = new Date();

    if (!prt || prt.used_at || prt.expires_at < now) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    const hashed = await this.hashingService.hash(senha);
    await this.userService.updatePassword(prt.user.id, hashed);

    prt.used_at = now;
    await this.resetTokenRepo.save(prt);

    await this.resetTokenRepo
      .createQueryBuilder()
      .update(PasswordResetToken)
      .set({ used_at: () => 'CURRENT_TIMESTAMP' })
      .where('userId = :userId AND used_at IS NULL', { userId: prt.user.id })
      .execute();

    return { message: 'Senha definida com sucesso' };
  }

  async sendLinkForgotPassword(email: string): Promise<void> {
    const user = await this.userService.findEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const token = this.generateToken();
    const tokenHash = this.hashToken(token);

    await this.resetTokenRepo.save(
      this.resetTokenRepo.create({
        user,
        tokenHash,
        expires_at: new Date(Date.now() + 1 * 60 * 60 * 1000),
      }),
    );

    await this.emailService.sendForgotPasswordMail(email, token);
  }
}
