import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  senha: string;

  @IsNotEmpty()
  token: string;
}
