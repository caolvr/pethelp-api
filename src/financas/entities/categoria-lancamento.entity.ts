import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lancamento } from './lancamento.entity';
import { Ong } from 'src/ong/entities/ong.entity';

@Entity('categoria_lancamento')
export class CategoriaLancamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ type: 'enum', enum: ['receita', 'despesa'] })
  tipo_categoria: string;

  @ManyToOne(() => Ong)
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;

  @OneToMany(() => Lancamento, (lancamento) => lancamento.categoria)
  lancamentos: Lancamento[];
}
