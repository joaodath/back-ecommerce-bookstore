import { IsNumber } from 'class-validator';

export class AddBookPublisherDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  publisherId: number;
}
