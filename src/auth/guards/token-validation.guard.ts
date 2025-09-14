import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import jwtConfig from '../config/jwt.config';
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';

@Injectable()
export class TokenValidationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const payloadToken = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      console.log(payloadToken);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }

    return !!token;
  }

  extractToken(request: Request): string | undefined {
    const authHeader = request.headers?.authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      return undefined;
    }

    return authHeader.split(' ')[1];
  }
}
