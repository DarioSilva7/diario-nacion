import {
  IsString,
  IsEmail,
  IsDateString,
  ValidateNested,
  IsNotEmpty,
  Matches,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Address } from '../../address/address.entity';

export class CreateContactDTO {
  @IsString()
  name!: string;

  @IsString()
  company!: string;

  @IsEmail()
  email!: string;

  @IsDateString()
  birthdate!: string;

  @IsString()
  @IsNotEmpty({ message: 'El número telefónico es obligatorio' })
  @Matches(/^\+\d{8,15}$/, {
    message: 'El número debe empezar con + seguido de 8 a 15 dígitos',
  })
  phonePersonal!: string;

  @IsString()
  @IsOptional()
  @Matches(/^\+\d{8,15}$/, {
    message: 'El número debe empezar con + seguido de 8 a 15 dígitos',
  })
  phoneWork?: string;

  @ValidateNested()
  @Type(() => Address)
  address!: Address;
}
