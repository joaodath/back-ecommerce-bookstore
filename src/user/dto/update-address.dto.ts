import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsBoolean()
  isMain: boolean;

  @IsString()
  cep: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  address: string;
}
