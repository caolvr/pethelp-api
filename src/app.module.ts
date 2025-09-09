import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './pets/pets.module';
import { FinancasModule } from './financas/financas.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { OngModule } from './ong/ong.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    PetsModule,
    OngModule,
    FinancasModule,
    AuthModule,
    DatabaseModule,
    UsersModule,
    EmailModule,
    FinancasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
