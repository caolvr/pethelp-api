import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from '../services/email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async send(@Body() body: { to: string; subject: string; text: string }) {
    return this.emailService.sendMail(body.to, body.subject, body.text);
  }
}
