import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findAll(ongId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { ong: { id: ongId } },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        celular: true,
        ativo: true,
        is_admin: true,
      },
    });
  }

  findEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  findOne(email: string, manager?: EntityManager): Promise<User | null> {
    const repo = manager ? manager.getRepository(User) : this.userRepository;
    return repo.findOne({
      where: { email },
      relations: ['ong'],
    });
  }

  findOneById(
    id: string,
    ongId: string,
    manager?: EntityManager,
  ): Promise<User | null> {
    const repo = manager ? manager.getRepository(User) : this.userRepository;
    return repo.findOne({
      where: { id, ong: { id: ongId } },
      relations: ['ong'],
    });
  }

  async create(
    createUserDto: CreateUserDto,
    ongId: string,
    manager?: EntityManager,
  ): Promise<User> {
    const repo = manager ? manager.getRepository(User) : this.userRepository;
    const tempPassword = crypto.randomBytes(16).toString('hex'); // 32 chars
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = repo.create({
      ...createUserDto,
      senha: passwordHash,
      ong: { id: ongId },
    });

    return repo.save(user);
  }

  async update(
    updateUserDto: UpdateUserDto,
    ongId?: string,
  ): Promise<User | null> {
    await this.userRepository.update(updateUserDto.id, {
      ...updateUserDto,
      ong: { id: ongId },
    });
    return this.userRepository.findOne({ where: { id: updateUserDto.id } });
  }
}
