import { IsString } from 'class-validator';

export class FetchCepDto {
  @IsString()
  cep: string;

  @IsString()
  logradouro: string;

  @IsString()
  complemento: string;

  @IsString()
  bairro: string;

  @IsString()
  localidade: string;

  @IsString()
  uf: string;

  @IsString()
  ibge: string;

  @IsString()
  gia: string;

  @IsString()
  ddd: string;

  @IsString()
  siafi: string;
}
