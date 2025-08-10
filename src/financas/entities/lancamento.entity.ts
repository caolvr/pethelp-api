import { Ong } from 'src/ong/entities/ong.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CategoriaLancamento } from './categoria-lancamento.entity';

@Entity('lancamento')
export class Lancamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  data: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: string;

  @Column({ length: 100 })
  descricao: string;

  @Column({ type: 'date' })
  data_vencimento: Date;

  @Column({ type: 'boolean' })
  pago: boolean;

  @Column({ type: 'date' })
  data_pagamento: Date;

  @Column({ length: 150 })
  observacoes: string;

  @ManyToOne(() => CategoriaLancamento, (categoria) => categoria.lancamentos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaLancamento;

  @ManyToOne(() => Ong)
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;
}
