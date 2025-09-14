import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailService } from 'src/email/services/email.service';
import { UserService } from 'src/users/services/user.service';
import { LoginDto } from '../dtos/LoginDto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing.service';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

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

  // async login(
  //   loginDto: LoginDto,
  // ): Promise<{ access_token: string; token_type: string; expires_in: number }> {
  //   let passwordIsValid = false;

  //   const user = await this.userService.findOne(loginDto.email);

  //   if (user) {
  //     passwordIsValid = await this.hashingService.compare(
  //       loginDto.senha,
  //       user.senha,
  //     );
  //   }

  //   if (!user) {
  //     throw new UnauthorizedException('Usuário não encontrado');
  //   }

  //   if (!user.ong) {
  //     throw new UnauthorizedException('Usuário sem ONG associada');
  //   }

  //   if (!passwordIsValid) {
  //     throw new UnauthorizedException('Credenciais inválidas');
  //   }

  //   const accessToken = await this.jwtService.signAsync(
  //     {
  //       sub: user.id,
  //       email: user.email,
  //       ongId: user.ong.id,
  //     },
  //     {
  //       audience: this.jwtConfiguration.audience,
  //       issuer: this.jwtConfiguration.issuer,
  //       secret: this.jwtConfiguration.secret,
  //       expiresIn: this.jwtConfiguration.expiresIn,
  //     },
  //   );

  //   return {
  //     access_token: accessToken,
  //     token_type: 'Bearer',
  //     expires_in: this.jwtConfiguration.expiresIn,
  //   };
  // }
}
