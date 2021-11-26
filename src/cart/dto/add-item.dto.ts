import { IsNumber, IsOptional } from 'class-validator';

export class AddItemDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  shoppingCartId?: number;
}
