import { IsString, IsNumber, IsDate } from 'class-validator';

export class AddCouponDto {
  @IsString()
  code: string;

  @IsDate()
  validUntil: Date;

  @IsNumber()
  shoppingCartId?: number;
}
