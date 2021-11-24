import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsNumber()
  id: number;

  @IsString()
  username?: string;

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
