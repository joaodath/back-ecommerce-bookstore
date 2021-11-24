import { IsBoolean, IsString } from 'class-validator';

export class UpdateAddressDto {
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
