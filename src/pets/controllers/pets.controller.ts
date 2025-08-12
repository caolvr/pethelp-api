import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PetsService } from '../services/pets.service';
import { Pet } from '../entities/pet.entity';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  findAll() {
    return this.petsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Post() create(@Body() pet: Pet) {
    return this.petsService.create(pet);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
}
