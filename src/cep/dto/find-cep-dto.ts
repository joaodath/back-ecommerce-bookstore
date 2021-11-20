import { IsString, Length } from 'class-validator';

export class FindCepDto {
  @IsString()
  @Length(8, 8)
  cep: string;
}
