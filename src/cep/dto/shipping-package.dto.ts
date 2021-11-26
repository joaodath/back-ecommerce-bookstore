import { IsArray, IsNumber, IsNumberString } from 'class-validator';

export class ShippingPackageDto {
  @IsNumberString()
  sCepOrigem: string;

  @IsNumberString()
  sCepDestino: string;

  @IsNumberString()
  nVlPeso: string; // Peso da encomenda, incluindo sua embalagem, em quilogramas.

  @IsNumber()
  nCdFormato: number; // Formato da encomenda: 1 – caixa/pacote, 2 – rolo/prisma, 3 – envelope.

  @IsNumber()
  nVlComprimento: number; // Comprimento da encomenda, incluindo embalagem, em centímetros.

  @IsNumber()
  nVlAltura: number; // Altura da encomenda, incluindo embalagem, em centímetros.

  @IsNumber()
  nVlLargura: number; // Largura da encomenda, incluindo embalagem, em centímetros.

  @IsNumber()
  nVlDiametro: number; // Diâmetro da encomenda, incluindo embalagem, em centímetros. Só se for necessário, do contrário informar 0.

  @IsArray()
  nCdServico: Array<string>; // Código do serviço de frete.
}

export class ShippingPackageBasicDto {
  @IsNumberString()
  nVlPeso: string; // Peso da encomenda, incluindo sua embalagem, em quilogramas.

  @IsNumber()
  nVlComprimento: number; // Comprimento da encomenda, incluindo embalagem, em centímetros.

  @IsNumber()
  nVlAltura: number; // Altura da encomenda, incluindo embalagem, em centímetros.

  @IsNumber()
  nVlLargura: number; // Largura da encomenda, incluindo embalagem, em centímetros.

  @IsNumber()
  nVlDiametro: number; // Diâmetro da encomenda, incluindo embalagem, em centímetros. Só se for necessário, do contrário informar 0.
}
