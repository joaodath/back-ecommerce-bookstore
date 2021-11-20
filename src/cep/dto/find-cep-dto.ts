import { IsNumberString, Length } from 'class-validator';

export class FindCepDto {
  @IsNumberString()
  @Length(8, 8)
  cep: string;
}
