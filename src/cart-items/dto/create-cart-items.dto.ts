import { IsNumber } from 'class-validator';

export class CreateCartItemsDto {
  @IsNumber()
  shoppingCartId: number;

  @IsNumber()
  bookId: number;

  @IsNumber()
  price: number;
}
