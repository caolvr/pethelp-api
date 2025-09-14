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
  readonly razao_social: string;

  @IsString()
  readonly cnpj: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly celular: string;

  @IsString()
  readonly cep: string;

  @IsString()
  readonly estado_uf: string;

  @IsString()
  readonly cidade: string;

  @IsString()
  readonly logradouro: string;

  @IsString()
  readonly bairro: string;

  @IsString()
  readonly numero: string;

  @IsString()
  readonly complemento: string;

  @IsString()
  readonly referencia: string;

  readonly responsavel: CreateUserDto;
}
