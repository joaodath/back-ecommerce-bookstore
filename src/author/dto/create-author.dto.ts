import { IsString, Length } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @Length(2, 100)
  name: string;
}
