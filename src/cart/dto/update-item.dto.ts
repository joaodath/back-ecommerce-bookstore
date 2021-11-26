import { IsNumber, IsOptional } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsNumber()
  bookId?: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  shoppingCartId?: number;

  @IsNumber()
  shoppingCartItemId: number;
}
