import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class DeleteItemDto {
  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  shoppingCartId?: number;
}
