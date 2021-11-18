import { IsString, IsNumber, IsDate } from 'class-validator';

export class AddCouponDto {
  @IsString()
  code: string;

  @IsNumber()
  shoppingCartId?: number;
}
