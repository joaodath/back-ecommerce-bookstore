import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  userId: number;

  @IsString()
  couponCodeId: string;

  @IsNumber()
  discountAmount: number;

  @IsNumber()
  shippingPrice: number;

  @IsNumber()
  totalPrice: number;

  @IsBoolean()
  isAnonymous: boolean;
}
