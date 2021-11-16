import { IsNumber } from 'class-validator';

export class RemoveBookPublisherDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  publisherId: number;
}
