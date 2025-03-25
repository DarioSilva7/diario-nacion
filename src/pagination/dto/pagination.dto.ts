import { IsOptional, IsString } from 'class-validator';

export class PaginationRequestDTO {
  @IsOptional()
  @IsString()
  cursor?: string;
}
