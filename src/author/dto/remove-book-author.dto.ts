import { IsNumber } from 'class-validator';

export class RemoveBookAuthorDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  categoryId: number;
}
