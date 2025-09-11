// create-user.dto.ts
import { IsNotEmpty, IsString, IsEmail, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly nome?: string;

  @IsEmail()
  readonly email?: string;

  @IsString()
  @IsNotEmpty()
  readonly cpf?: string;

  @IsString()
  readonly celular?: string;

  @IsString()
  readonly senha?: string;
}
