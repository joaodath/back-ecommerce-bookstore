import {
  IsString,
  IsUrl,
  Length,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

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

  @IsOptional()
  @IsBoolean()
  ebook?: boolean;

  @IsOptional()
  @IsBoolean()
  hardCover?: boolean;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  length?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsString()
  isbn13: string;

  @IsString()
  isbn10: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discountedPrice?: number;

  @IsOptional()
  @IsBoolean()
  discountCheck?: boolean;

  @IsOptional()
  @IsNumber()
  inventoryAmount?: number;

  @IsOptional()
  @IsNumber()
  authorId?: number;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  publisherId?: number;

  @IsOptional()
  @IsString()
  publisher?: string;
}
