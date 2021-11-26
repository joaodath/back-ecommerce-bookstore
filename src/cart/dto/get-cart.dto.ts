import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetCartDto {
  @ApiProperty()
  @IsNumber()
  shoppingCartId: number;
}
