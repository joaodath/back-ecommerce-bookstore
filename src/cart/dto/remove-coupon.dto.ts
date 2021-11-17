import { IsString, IsNumber } from 'class-validator';

export class RemoveCouponDto {
  @IsString()
  code: string;

  @IsNumber()
  shoppingCartId?: number;
}
