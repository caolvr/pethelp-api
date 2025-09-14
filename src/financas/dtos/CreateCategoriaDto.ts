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
  readonly nome: string;

  @IsEnum(['receita', 'despesa'])
  readonly tipo: string;

  @IsUUID()
  readonly ong_id?: string;
}
