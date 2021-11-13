import { IsNumber } from 'class-validator';

export class AddBookAuthorDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  authorId: number;
}
