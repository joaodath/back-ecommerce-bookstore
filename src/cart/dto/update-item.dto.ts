import { IsNumber } from 'class-validator';

export class UpdateItemDto {
  @IsNumber()
  bookId?: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  shoppingCartId?: number;

  @IsNumber()
  shoppingCartItemId: number;
}
