import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddBookCategoryDto {
  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsNumber()
  categoryId: number;
}
