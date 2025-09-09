import {
  IsString,
  IsInt,
  MinLength,
  Min,
  IsOptional,
  IsEnum,
  IsUUID,
  IsUrl,
  IsDate,
  IsDecimal,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { CategoriaLancamento } from '../entities/categoria-lancamento.entity';

export class CreateLancamentoDto {
  @IsDate()
  data: Date;

  @IsDecimal()
  valor: string;

  @IsString()
  descricao: string;

  @IsDate()
  data_vencimento: Date;

  @IsBoolean()
  pago: boolean;

  @IsDate()
  data_pagamento: Date;

  @IsString()
  observacoes: string;

  @IsUUID()
  categoria_id?: string;

  @IsUUID()
  ong_id?: string;
}
