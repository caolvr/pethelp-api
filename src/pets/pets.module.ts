import { Module } from '@nestjs/common';
import { PetsController } from './controllers/pets.controller';
import { PetsService } from './services/pets.service';
import { BlackbazeService } from './services/backblaze.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pet]), AuthModule],
  controllers: [PetsController],
  providers: [PetsService, BlackbazeService],
  exports: [BlackbazeService],
})
export class PetsModule {}
