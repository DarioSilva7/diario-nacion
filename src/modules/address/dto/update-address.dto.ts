import { IsOptional, IsString } from 'class-validator';

export class UpdateAddressDTO {
  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
