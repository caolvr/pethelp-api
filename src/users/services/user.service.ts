import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { AuthService } from 'src/auth/services/auth.service';
import { EmailService } from 'src/email/services/email.service';
import { PasswordResetToken } from '../../auth/entities/password-reset-tokens.entity';
import { Ong } from 'src/ong/entities/ong.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly emailService: EmailService,
    @InjectRepository(PasswordResetToken)
    private readonly resetTokenRepo: Repository<PasswordResetToken>,
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

  async create(createUserDto: CreateUserDto, ongId: string): Promise<User> {
    const repo = this.userRepository;
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = repo.create({
      ...createUserDto,
      senha: passwordHash,
      ong: { id: ongId },
    });

    const savedUser = await repo.save(user);

    await this.sendLinkCreatePassword(savedUser.email);

    return savedUser;
  }

  async createResponsavel(
    createUserDto: CreateUserDto,
    ong: Ong,
    manager?: EntityManager,
  ): Promise<User> {
    const repo = manager ? manager.getRepository(User) : this.userRepository;
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = repo.create({
      ...createUserDto,
      senha: passwordHash,
      ong,
    });

    const savedUser = await repo.save(user);

    await this.sendLinkCreatePassword(savedUser.email, manager);

    return savedUser;
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

  async updatePassword(userId: string, senhaHash: string): Promise<void> {
    await this.userRepository.update(userId, { senha: senhaHash });
  }

  async sendLinkCreatePassword(
    email: string,
    manager?: EntityManager,
  ): Promise<void> {
    const user = await this.findOne(email, manager);
    if (!user) {
      throw new Error('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const resetRepo = manager
      ? manager.getRepository(PasswordResetToken)
      : this.resetTokenRepo;

    await resetRepo.save(
      resetRepo.create({
        user,
        tokenHash,
        expires_at,
      }),
    );

    await this.emailService.sendCreatePasswordMail(email, token, user.nome);
  }
}
