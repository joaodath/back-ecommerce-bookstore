import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateUserCartDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  shoppingCartId: number;
}
