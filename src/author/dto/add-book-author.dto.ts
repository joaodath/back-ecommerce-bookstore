import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddBookAuthorDto {
  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsNumber()
  authorId: number;
}
