import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../entities/pet.entity';
import { CreatePetDto } from '../dtos/CreatePetDto';

@Injectable()
export class PetsService {
  constructor(@InjectRepository(Pet) private petsRepository: Repository<Pet>) {}

  findAll(ongId: string): Promise<Pet[]> {
    return this.petsRepository.find({ where: { ong: { id: ongId } } });
  }

  findAllAdocao(): Promise<Pet[]> {
    return this.petsRepository.find({
      where: { status: 'disponivel' },
    });
  }

  findOne(id: string, ongId: string): Promise<Pet | null> {
    return this.petsRepository.findOneBy({ id: id, ong: { id: ongId } });
  }

  async remove(id: string, ongId: string): Promise<void> {
    await this.petsRepository.delete({ id: id, ong: { id: ongId } });
  }

  async create(createPetDto: CreatePetDto, ongId: string): Promise<Pet> {
    const pet = this.petsRepository.create({
      ...createPetDto,
      ong: { id: ongId },
    });
    return await this.petsRepository.save(pet);
  }

  async update(id: string, pet: Pet, ongId: string): Promise<Pet> {
    await this.petsRepository.update({ id: id, ong: { id: ongId } }, pet);
    const updatedPet = await this.petsRepository.findOneBy({
      id: id,
      ong: { id: ongId },
    });
    if (!updatedPet) {
      throw new Error(`Pet com o id ${id} não encontrado após update.`);
    }
    return updatedPet;
  }
}
