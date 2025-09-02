import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../entities/pet.entity';
import { CreatePetDto } from '../dtos/CreatePetDto';

@Injectable()
export class PetsService {
  constructor(@InjectRepository(Pet) private petsRepository: Repository<Pet>) {}

  findAll(): Promise<Pet[]> {
    return this.petsRepository.find();
  }

  findOne(id: string): Promise<Pet | null> {
    return this.petsRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.petsRepository.delete(id);
  }

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const pet = this.petsRepository.create(createPetDto);
    return await this.petsRepository.save(pet);
  }

  async update(id: string, pet: Pet): Promise<Pet> {
    await this.petsRepository.update(id, pet);
    const updatedPet = await this.petsRepository.findOneBy({ id });
    if (!updatedPet) {
      throw new Error(`Pet com o id ${id} não encontrado após update.`);
    }
    return updatedPet;
  }
}
