import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

const cookieExtractor = (req: Request) => {
  const t = req?.cookies?.['access_token'];
  if (!t) {
    console.log('[JWT] Nenhum cookie access_token');
  }
  return t || null;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? '',
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER,
    });
  }

  async validate(payload: any) {
    return {
      email: payload.email,
      sub: payload.sub,
      ongId: payload.ongId,
      isAdmin: payload.isAdmin,
    };
  }
}
