import { IsNumber } from 'class-validator';

export class AddBookCategoryDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  categoryId: number;
}
