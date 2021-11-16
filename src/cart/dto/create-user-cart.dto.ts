import { IsNumber } from 'class-validator';

export class CreateUserCartDto {
  @IsNumber()
  cartId?: number;
}
