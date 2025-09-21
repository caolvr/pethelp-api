import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../entities/pet.entity';
import { CreatePetDto } from '../dtos/CreatePetDto';
import { FilterAdocaoDto } from '../dtos/FilterAdocaoDto';
import { UpdatePetDto } from '../dtos/UpdatePetDto';

@Injectable()
export class PetsService {
  constructor(@InjectRepository(Pet) private petsRepository: Repository<Pet>) {}

  findAll(ongId: string): Promise<Pet[]> {
    return this.petsRepository.find({ where: { ong: { id: ongId } } });
  }

  async findAllAdocao(filter?: FilterAdocaoDto): Promise<{
    data: Pet[];
    meta: { total: number; page: number; lastPage: number; limit: number };
  }> {
    console.log(filter);
    const page = Math.max(1, filter?.page || 1);
    const limit = Math.min(50, Math.max(1, filter?.limit || 12));
    const skip = (page - 1) * limit;

    const qb = this.petsRepository
      .createQueryBuilder('pet')
      .leftJoinAndSelect('pet.ong', 'ong')
      .where('pet.status = :status', { status: 'disponivel' });

    if (filter?.cidade) {
      qb.andWhere('ong.cidade = :cidade', { cidade: filter.cidade });
    }

    if (filter?.especies && filter.especies.length > 0) {
      qb.andWhere('pet.especie IN (:...especies)', {
        especies: filter.especies,
      });
    }

    if (filter?.portes && filter.portes.length > 0) {
      qb.andWhere('pet.porte IN (:...portes)', { portes: filter.portes });
    }

    if (filter?.idadeCategoria) {
      const idadeExpr = 'TIMESTAMPDIFF(MONTH, pet.data_nascimento, CURDATE())';
      let idadeMin: number | undefined;
      let idadeMax: number | undefined;

      switch (filter.idadeCategoria) {
        case 'filhote':
          idadeMin = 0;
          idadeMax = 11;
          break;
        case 'adulto':
          idadeMin = 12;
          idadeMax = 83;
          break;
        case 'senior':
          idadeMin = 84;
          break;
      }

      if (idadeMin !== undefined) {
        qb.andWhere(`${idadeExpr} >= :idadeMin`, { idadeMin });
      }
      if (idadeMax !== undefined) {
        qb.andWhere(`${idadeExpr} <= :idadeMax`, { idadeMax });
      }
    }

    qb.orderBy('pet.nome', 'ASC');
    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();
    const lastPage = Math.max(1, Math.ceil(total / limit));
    return { data, meta: { total, page, lastPage, limit } };
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

  async update(id: string, pet: UpdatePetDto, ongId: string): Promise<Pet> {
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
