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
  IsNotEmpty,
} from 'class-validator';

export class CreateLancamentoDto {
  @IsDate()
  readonly data: Date;

  @IsDecimal()
  @IsNotEmpty()
  readonly valor: string;

  @IsString()
  @IsNotEmpty()
  readonly descricao: string;

  @IsDate()
  readonly data_vencimento: Date;

  @IsBoolean()
  readonly pago: boolean;

  @IsDate()
  readonly data_pagamento: Date;

  @IsString()
  readonly observacoes: string;

  @IsUUID()
  readonly categoria_id?: string;

  @IsUUID()
  readonly ong_id?: string;
}
