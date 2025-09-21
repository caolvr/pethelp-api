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
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  @MinLength(2)
  readonly nome: string;

  @IsString()
  @IsEnum(['cao', 'gato'])
  readonly especie: string;

  @IsString()
  readonly data_nascimento?: string;

  @IsOptional()
  @IsString()
  readonly raca?: string;

  @IsEnum(['macho', 'femea'])
  readonly sexo: string;

  @IsEnum(['pequeno', 'medio', 'grande'])
  readonly porte: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  readonly informacoes?: string;

  @IsOptional()
  @IsEnum(['disponivel', 'adotado'])
  readonly status?: string;

  @IsOptional()
  @IsString()
  readonly foto_url?: string;
}
