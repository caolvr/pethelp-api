import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Ong } from '../entities/ong.entity';
import { CreateOngDto } from '../dtos/CreateOngDto';
import { User } from '../../users/entities/user.entity';
import { EmailService } from 'src/email/services/email.service';
import { UserService } from 'src/users/services/user.service';
import * as crypto from 'crypto';
import { PasswordResetToken } from 'src/auth/entities/password-reset-tokens.entity';

@Injectable()
export class OngService {
  constructor(
    @InjectRepository(Ong) private ongsRepository: Repository<Ong>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
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
    console.log('Criando ONG:', createOngDto);
    const { responsavel, ...ongData } = createOngDto;

    try {
      const { ong, user, token } = await this.dataSource.transaction(
        async (manager) => {
          const ongRepo = manager.getRepository(Ong);
          const prtRepo = manager.getRepository(PasswordResetToken);

          const existingUser = await this.userService.findOne(
            responsavel.email,
            manager,
          );
          if (existingUser) {
            throw new ConflictException('E-mail do responsável já cadastrado.');
          }

          const ong = ongRepo.create(ongData);
          await ongRepo.save(ong);

          const user = await this.userService.create(
            responsavel,
            ong.id,
            manager,
          );

          const token = crypto.randomBytes(32).toString('hex'); // 64 chars
          const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
          const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

          await prtRepo.save(
            prtRepo.create({
              user,
              tokenHash,
              expires_at,
            }),
          );

          return { ong, user, token };
        },
      );

      // try {
      //   await this.emailService.sendMail(
      //     responsavel.email,
      //     'Bem-vindo à Plataforma PetHelp',
      //     `Olá ${responsavel.nome},\n\nSua ONG foi registrada com sucesso na plataforma PetHelp.\nCrie uma senha para sua conta: http://localhost:3001/login/create-password?token=${token}\nEquipe PetHelp`,
      //   );
      // } catch (error) {
      //   console.error('Erro ao enviar e-mail ao responsável:', error);
      // }

      return ong;
    } catch (e: any) {
      if (e instanceof ConflictException) {
        throw e;
      }

      throw e;
    }
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
