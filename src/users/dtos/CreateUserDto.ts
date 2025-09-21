// create-user.dto.ts
import { IsNotEmpty, IsString, IsEmail, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly nome: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly cpf: string;

  @IsString()
  readonly celular: string;

  @IsBoolean()
  readonly ativo: boolean;

  @IsBoolean()
  readonly is_admin: boolean;
}
