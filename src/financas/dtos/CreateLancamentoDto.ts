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
  @IsString()
  readonly data: string;

  @IsNumber()
  @IsNotEmpty()
  readonly valor: number;

  @IsString()
  @IsNotEmpty()
  readonly descricao: string;

  @IsOptional()
  @IsString()
  readonly data_vencimento?: string;

  @IsBoolean()
  readonly pago: boolean;

  @IsOptional()
  @IsString()
  readonly data_pagamento?: string;

  @IsOptional()
  @IsString()
  readonly observacoes?: string;

  @IsUUID()
  readonly categoria_id?: string;
}
