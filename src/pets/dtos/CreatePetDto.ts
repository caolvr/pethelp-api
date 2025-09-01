import {
  IsString,
  IsInt,
  MinLength,
  Min,
  IsOptional,
  IsEnum,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  @MinLength(2)
  nome: string;

  @IsString()
  @IsEnum(['cao', 'gato'])
  especie: string;

  @IsString()
  idade: string;

  @IsOptional()
  @IsString()
  raca?: string;

  @IsEnum(['macho', 'femea'])
  sexo: string;

  @IsEnum(['pequeno', 'medio', 'grande'])
  porte: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  informacoes?: string;

  @IsOptional()
  @IsEnum(['disponivel', 'adotado'])
  status?: string;

  @IsOptional()
  @IsString()
  foto_url?: string;

  @IsUUID()
  ong_id?: string;
}
