import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { LoginDto } from '../dtos/LoginDto';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { SetPasswordDto } from '../dtos/SetPasswordDto';
import { EmailService } from 'src/email/services/email.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.sendLinkForgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { to: string; subject: string; text: string },
  ) {}

  @Post('set-password')
  async setPassword(@Body() dto: SetPasswordDto) {
    return this.authService.setPassword(dto.token, dto.senha);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginWithCookie(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.login(req.user);

    const maxAgeMs = 60 * 60 * 1000;

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: maxAgeMs,
      domain: 'pethelp-api-production.up.railway.app',
    });

    return { access_token };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    return { message: 'Logout realizado com sucesso' };
  }
}
