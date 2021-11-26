import { IsNumber, IsString } from 'class-validator';

export class ShippingPriceDto {
  @IsString()
  cep: string;

  @IsNumber()
  shoppingCartId: number;
}
