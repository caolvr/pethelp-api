import {
  IsString,
  IsInt,
  MinLength,
  Min,
  IsOptional,
  IsEnum,
  IsUUID,
  IsUrl,
  IsEmail,
} from 'class-validator';
import { CreateUserDto } from 'src/users/dtos/CreateUserDto';

export class CreateOngDto {
  @IsString()
  @MinLength(2)
  razao_social: string;

  @IsString()
  cnpj: string;

  @IsEmail()
  email: string;

  @IsString()
  celular: string;

  @IsString()
  cep: string;

  @IsString()
  estado_uf: string;

  @IsString()
  cidade: string;

  @IsString()
  logradouro: string;

  @IsString()
  bairro: string;

  @IsString()
  numero: string;

  @IsString()
  complemento: string;

  @IsString()
  referencia: string;

  responsavel: CreateUserDto;
}
