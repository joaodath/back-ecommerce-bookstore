import { IsNumber } from 'class-validator';

export class RemoveBookCategoryDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  categoryId: number;
}
