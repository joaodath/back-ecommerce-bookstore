import { IsString, IsUrl, Length, IsNumber, IsBoolean } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @Length(2, 200)
  title: string;

  @IsString()
  language: string;

  @IsNumber()
  edition: number;

  @IsString()
  @Length(2, 1000)
  description: string;

  @IsString()
  @IsUrl()
  coverImg: string;

  @IsBoolean()
  ebook: boolean;

  @IsBoolean()
  hardCover: boolean;

  @IsNumber()
  height: number;

  @IsNumber()
  width: number;

  @IsNumber()
  length: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  isbn13: number;

  @IsNumber()
  isbn10: number;

  @IsNumber()
  score: number;

  @IsNumber()
  price: number;

  @IsNumber()
  discountedPrice: number;

  @IsBoolean()
  discountCheck: boolean;

  @IsNumber()
  inventoryAmount: number;
}
