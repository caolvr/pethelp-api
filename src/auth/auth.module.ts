import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { HashingService } from './services/hashing.service';
import { BcryptService } from './services/bcrypt.service';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokenValidationGuard } from './guards/token-validation.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password-reset-tokens.entity';
import { EmailService } from 'src/email/services/email.service';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    UsersModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    PassportModule,
    TypeOrmModule.forFeature([PasswordResetToken]),
  ],
  controllers: [AuthController],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    AuthService,
    LocalStrategy,
    JwtStrategy,
    EmailService,
  ],
  exports: [HashingService, JwtModule],
})
export class AuthModule {}
