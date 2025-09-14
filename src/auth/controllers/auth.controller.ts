import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { LoginDto } from '../dtos/LoginDto';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: { to: string; subject: string; text: string },
  ) {}

  @Post('reset-password')
  async resetPassword(
    @Body() body: { to: string; subject: string; text: string },
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }
}
