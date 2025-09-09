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

export class CreateCategoriaDto {
  @IsString()
  @MinLength(2)
  nome: string;

  @IsEnum(['receita', 'despesa'])
  tipo: string;

  @IsUUID()
  ong_id?: string;
}
