import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSuperAdminDto {
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  documentNumber?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;
}
