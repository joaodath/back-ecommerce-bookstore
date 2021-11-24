import { IsNumber, IsOptional } from 'class-validator';

export class CreateUserCartDto {
  @IsOptional()
  @IsNumber()
  cartId: number;
}
