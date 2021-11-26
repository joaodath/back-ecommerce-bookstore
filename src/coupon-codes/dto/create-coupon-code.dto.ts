import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateCouponCodeDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNumber()
  discountAmount: number;

  @ApiProperty()
  @IsDateString()
  validUntil: string;

  @ApiProperty()
  @IsDateString()
  createdAt: string;

  @ApiProperty()
  @IsDateString()
  updatedAt: string;

  @ApiProperty()
  @IsNumber()
  useLimit: number;

  @ApiProperty()
  @IsNumber()
  useCount: number;
}
