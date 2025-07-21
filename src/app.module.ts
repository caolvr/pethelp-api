import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './pets/pets.module';
import { FinancasModule } from './financas/financas.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PetsModule, FinancasModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
