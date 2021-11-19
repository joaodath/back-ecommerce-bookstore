import { IsNumber } from 'class-validator';

export class GetCartDto {
  @IsNumber()
  shoppingCartId: number;
}
