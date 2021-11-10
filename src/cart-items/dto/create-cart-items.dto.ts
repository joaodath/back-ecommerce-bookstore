import { IsNumber } from 'class-validator';

export class CreateCartItemsDto {
  @IsNumber()
  shoppingCartId?: number;

  @IsNumber()
  bookId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price?: number;

  @IsNumber()
  shoppingCartItemId?: number;
}
