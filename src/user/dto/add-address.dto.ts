import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AddAddressDto {
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
