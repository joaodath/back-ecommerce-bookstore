import { IsNumber } from 'class-validator';

export class AddBookAuthorDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  categoryId: number;
}
