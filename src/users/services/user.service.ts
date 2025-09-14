import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['ong'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);

    if (newUser.cpf) {
      const existingUser = await this.userRepository.findOne({
        where: { cpf: newUser.cpf },
      });
      if (existingUser) {
        throw new ConflictException(
          'Usuário responsável já cadastrado com este CPF',
        );
      }
    }

    return this.userRepository.save(newUser);
  }

  async update(updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(updateUserDto.id, updateUserDto);
    return this.userRepository.findOne({ where: { id: updateUserDto.id } });
  }
}
