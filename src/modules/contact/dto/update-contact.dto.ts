import {
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAddressDTO } from '../../address/dto/update-address.dto';

export class UpdateContactDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{8,15}$/, {
    message: 'Formato inválido. Ejemplo válido: +5491112345678',
  })
  phonePersonal?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDTO)
  address?: UpdateAddressDTO;
}
