import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateCartDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsString()
  couponCodeId: string;

  @ApiProperty()
  @IsNumber()
  discountAmount: number;

  @ApiProperty()
  @IsNumber()
  shippingPrice: number;

  @ApiProperty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty()
  @IsBoolean()
  isAnonymous: boolean;
}
