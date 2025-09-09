import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('forgot-password')
  async forgotPassword(
    @Body() body: { to: string; subject: string; text: string },
  ) {}

  @Post('reset-password')
  async resetPassword(
    @Body() body: { to: string; subject: string; text: string },
  ) {}
}
