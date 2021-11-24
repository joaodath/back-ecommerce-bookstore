import { IsString, Length } from 'class-validator';

export class ReturnCepDto {
  @IsString()
  @Length(8, 8)
  cep?: string;

  @IsString()
  logradouro?: string;

  @IsString()
  complemento?: string;

  @IsString()
  bairro?: string;

  @IsString()
  localidade?: string;

  @IsString()
  uf?: string;

  @IsString()
  unidade?: string;

  @IsString()
  ibge?: string;

  @IsString()
  gia?: string;
}
