import { Module } from '@nestjs/common';
import { PetsController } from './controllers/pets.controller';
import { PetsService } from './services/pets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pet])],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
