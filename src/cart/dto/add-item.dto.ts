import { IsNumber } from 'class-validator';

export class AddItemDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  shoppingCartId: number;
}
