import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

//import {}
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(2, 200)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  profilePhoto?: string;

  @ApiProperty()
  @IsDateString()
  birthDate: Date | string;

  @ApiProperty()
  @IsString()
  cpf: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phonenumber?: string;
}
