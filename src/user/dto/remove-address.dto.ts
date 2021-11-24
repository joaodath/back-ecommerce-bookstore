import { IsNumber } from 'class-validator';

export class RemoveAddressDto {
  @IsNumber()
  id: number;
}
