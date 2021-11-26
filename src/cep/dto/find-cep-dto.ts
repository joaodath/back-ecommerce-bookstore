import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, Length } from 'class-validator';

export class FindCepDto {
  @ApiProperty()
  @IsNumberString()
  @Length(8, 8)
  cep: string;
}
