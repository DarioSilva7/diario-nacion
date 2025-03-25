import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateAddressDTO {
  @IsString()
  street!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;
}
