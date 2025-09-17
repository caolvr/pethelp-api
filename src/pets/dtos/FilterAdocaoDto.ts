import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, IsIn } from 'class-validator';

export class FilterAdocaoDto {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 12))
  @IsInt()
  @IsPositive()
  limit?: number = 12;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
      : undefined,
  )
  especies?: string[];

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
      : undefined,
  )
  portes?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['filhote', 'adulto', 'senior'])
  idadeCategoria?: string;
}
