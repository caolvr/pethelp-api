import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/services/email.service';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findEmail(email);
    if (user) {
        
    }
  }
}
