import {
  IsDateString,
  IsEmail,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

//import {}
export class CreateUserDto {
  @IsString()
  @Length(2, 200)
  name: string;

  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsUrl()
  profilePhoto: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  cpf: string;

  @IsString()
  cep: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsString()
  phonenumber: string;
}
