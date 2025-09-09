import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ong } from '../entities/ong.entity';
import { CreateOngDto } from '../dtos/CreateOngDto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/services/email.service';

@Injectable()
export class OngService {
  constructor(
    @InjectRepository(Ong) private ongsRepository: Repository<Ong>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  findAll(): Promise<Ong[]> {
    return this.ongsRepository.find();
  }

  findOne(id: string): Promise<Ong | null> {
    return this.ongsRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.ongsRepository.delete(id);
  }

  async create(createOngDto: CreateOngDto): Promise<Ong> {
    const { responsavel, ...ongData } = createOngDto;

    const ong = this.ongsRepository.create(ongData);
    await this.ongsRepository.save(ong);

    const senhaHash = await bcrypt.hash('123546', 10);
    const user = this.userRepository.create({
      ...responsavel,
      senha: senhaHash,
      ong,
    });
    await this.userRepository.save(user);

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
