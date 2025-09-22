import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ong } from './entities/ong.entity';
import { OngService } from './services/ong.service';
import { OngController } from './controllers/ong.controller';
import { User } from '../users/entities/user.entity';
import { EmailService } from 'src/email/services/email.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ong]),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    EmailModule,
  ],
  providers: [OngService],
  controllers: [OngController],
})
export class OngModule {}
