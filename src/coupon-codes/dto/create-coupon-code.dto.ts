import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateCouponCodeDto {
  @IsString()
  code: string;

  @IsNumber()
  discountAmount: number;

  @IsDateString()
  validUntil: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @IsNumber()
  useLimit: number;

  @IsNumber()
  useCount: number;
}
