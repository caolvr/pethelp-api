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
  valor: number;

  @Column({ length: 100 })
  descricao: string;

  @Column({ type: 'date', nullable: true })
  data_vencimento: Date;

  @Column({ type: 'boolean' })
  pago: boolean;

  @Column({ type: 'date', nullable: true })
  data_pagamento: Date;

  @Column({ length: 150, nullable: true })
  observacoes: string;

  @ManyToOne(() => CategoriaLancamento, (categoria) => categoria.lancamentos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaLancamento;

  @ManyToOne(() => Ong)
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;
}
