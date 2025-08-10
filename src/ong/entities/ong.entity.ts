import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ong')
export class Ong {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  razao_social: string;

  @Column({ length: 18, unique: true })
  cnpj: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 20 })
  celular: string;

  @Column({ length: 9 })
  cep: string;

  @Column({ length: 2 })
  estado_uf: string;

  @Column({ length: 100 })
  cidade: string;

  @Column({ length: 255 })
  logradouro: string;

  @Column({ length: 100 })
  bairro: string;

  @Column({ length: 10 })
  numero: string;

  @Column({ length: 255, nullable: true })
  complemento?: string;

  @Column({ length: 255, nullable: true })
  referencia?: string;
}
