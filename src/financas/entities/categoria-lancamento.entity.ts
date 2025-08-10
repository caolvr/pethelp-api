import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lancamento } from './lancamento.entity';

@Entity('categoria_lancamento')
export class CategoriaLancamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ type: 'enum', enum: ['receita', 'despesa'] })
  tipo: string;

  @OneToMany(() => Lancamento, (lancamento) => lancamento.categoria)
  lancamentos: Lancamento[];
}
