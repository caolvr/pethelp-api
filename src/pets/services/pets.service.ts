import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../entities/pet.entity';

@Injectable()
export class PetsService {
  constructor(@InjectRepository(Pet) private petsRepository: Repository<Pet>) {}

  findAll(): Promise<Pet[]> {
    return this.petsRepository.find();
  }

  findOne(id: string): Promise<Pet | null> {
    return this.petsRepository.findOneBy({ id: parseInt(id) });
  }

  async remove(id: number): Promise<void> {
    await this.petsRepository.delete(id);
  }
}
