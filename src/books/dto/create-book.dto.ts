import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  Length,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @Length(2, 200)
  title: string;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsNumber()
  edition: number;

  @ApiProperty()
  @IsString()
  @Length(2, 1000)
  description: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  coverImg: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ebook?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hardCover?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  length?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty()
  @IsString()
  isbn13: string;

  @ApiProperty()
  @IsString()
  isbn10: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discountedPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  discountCheck?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  inventoryAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  authorId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  publisherId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  publisher?: string;
}
