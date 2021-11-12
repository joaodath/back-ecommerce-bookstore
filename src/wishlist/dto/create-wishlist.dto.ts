import { IsString, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(3, 100)
  name: string;
}
