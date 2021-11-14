import { IsNumber } from 'class-validator';

export class DeleteItemDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  shoppingCartId?: number;
}
