import {
  IsString,
  IsOptional,
  MinLength,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nome?: string;

  @IsOptional()
  @IsEnum(['cao', 'gato'])
  especie?: string;

  @IsOptional()
  @IsDateString()
  data_nascimento?: string;

  @IsOptional()
  @IsString()
  raca?: string;

  @IsOptional()
  @IsEnum(['macho', 'femea'])
  sexo?: string;

  @IsOptional()
  @IsEnum(['pequeno', 'medio', 'grande'])
  porte?: string;

  @IsOptional()
  @IsString()
  informacoes?: string;

  @IsOptional()
  @IsEnum(['disponivel', 'adotado'])
  status?: string;

  @IsOptional()
  @IsString()
  foto_url?: string;
}
