import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty()
  @IsString()
  @Length(2, 280)
  name: string;
}
