import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ong } from './entities/ong.entity';
import { OngService } from './services/ong.service';
import { OngController } from './controllers/ong.controller';
import { User } from 'src/users/entities/user.entity';
import { EmailService } from 'src/email/services/email.service';
import { UserService } from 'src/users/services/user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ong]),
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  providers: [OngService, EmailService, UserService],
  controllers: [OngController],
})
export class OngModule {}
