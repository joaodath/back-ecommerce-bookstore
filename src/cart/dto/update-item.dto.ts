import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bookId?: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  shoppingCartId?: number;

  @ApiProperty()
  @IsNumber()
  shoppingCartItemId: number;
}
