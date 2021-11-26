import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @Length(2, 200)
  title?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsNumber()
  edition?: number;

  @IsOptional()
  @IsString()
  @Length(2, 1000)
  description?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  coverImg?: string;

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

  @IsOptional()
  @IsString()
  isbn13?: string;

  @IsOptional()
  @IsString()
  isbn10?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

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
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  publisher?: string;
}
