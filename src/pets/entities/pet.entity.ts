import { Ong } from '../../ong/entities/ong.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ForeignKey,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('pet')
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  nome: string;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'simple-enum' : 'enum',
    enum: ['cao', 'gato'],
  })
  especie: string;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'simple-enum' : 'enum',
    enum: ['macho', 'femea'],
  })
  sexo: string;

  @Column({ type: 'date', nullable: true })
  data_nascimento: Date | null;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'simple-enum' : 'enum',
    enum: ['pequeno', 'medio', 'grande'],
  })
  porte: string;

  @Column('varchar', { length: 350, nullable: true })
  informacoes?: string;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'simple-enum' : 'enum',
    enum: ['disponivel', 'adotado'],
  })
  status?: string;

  @Column('varchar', { length: 200, nullable: true })
  foto_url?: string;

  @ManyToOne(() => Ong)
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;
}
