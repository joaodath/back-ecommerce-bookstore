import { IsString, IsNumber } from 'class-validator';

export class CreateShoppingHistoryDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  couponCodeId: string;

  @IsString()
  couponCodeStr: string;

  @IsNumber()
  discountAmount: number;

  @IsNumber()
  shippingPrice: number;
}
