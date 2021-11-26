import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddBookPublisherDto {
  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsNumber()
  publisherId: number;
}
