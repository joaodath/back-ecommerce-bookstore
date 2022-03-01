import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ShippingPriceDto {
  @ApiProperty()
  @IsString()
  cep: string;

  @ApiProperty()
  @IsNumber()
  shoppingCartId: number;
}
