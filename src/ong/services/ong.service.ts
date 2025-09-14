import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ong } from '../entities/ong.entity';
import { CreateOngDto } from '../dtos/CreateOngDto';
import { User } from 'src/users/entities/user.entity';
import { EmailService } from 'src/email/services/email.service';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class OngService {
  constructor(
    @InjectRepository(Ong) private ongsRepository: Repository<Ong>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  findAll(): Promise<Ong[]> {
    return this.ongsRepository.find();
  }

  async findOne(id: string): Promise<Ong | null> {
    const ong = await this.ongsRepository.findOneBy({ id: id });

    console.log(ong);
    if (ong === null) {
      throw new NotFoundException('ONG não encontrada');
    }

    return ong;
  }

  async remove(id: string): Promise<void> {
    const ong = await this.findOne(id);
    if (!ong) {
      throw new NotFoundException('ONG não encontrada para remoção');
    }

    await this.ongsRepository.delete(id);
  }

  async create(createOngDto: CreateOngDto): Promise<Ong> {
    const { responsavel, ...ongData } = createOngDto;

    const ong = this.ongsRepository.create(ongData);
    await this.ongsRepository.save(ong);

    try {
      await this.userService.create({
        ...responsavel,
      });
    } catch (e) {
      if (e instanceof ConflictException) {
        throw new ConflictException(e.message);
      }
    }

    try {
      await this.emailService.sendMail(
        responsavel.email,
        'Bem-vindo à Plataforma PetHelp',
        `Olá ${responsavel.nome},\n\nSua ONG foi registrada com sucesso na plataforma PetHelp.\n\nDetalhes de login:\nEmail: ${responsavel.email}\nSenha: 123546\n\nPor favor, altere sua senha após o primeiro login.\n\nAtenciosamente,\nEquipe PetHelp`,
      );
    } catch (error) {}

    return ong;
  }

  async update(id: string, pet: Ong): Promise<Ong> {
    await this.ongsRepository.update(id, pet);
    const updatedOng = await this.ongsRepository.findOneBy({ id });
    if (!updatedOng) {
      throw new Error(`Pet com o id ${id} não encontrado após update.`);
    }
    return updatedOng;
  }
}
