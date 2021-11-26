import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsNumberString } from 'class-validator';

export class ShippingPackageDto {
  @ApiProperty()
  @IsNumberString()
  sCepOrigem: string;

  @ApiProperty()
  @IsNumberString()
  sCepDestino: string;

  @ApiProperty()
  @IsNumberString()
  nVlPeso: string; // Peso da encomenda, incluindo sua embalagem, em quilogramas.

  @ApiProperty()
  @IsNumber()
  nCdFormato: number; // Formato da encomenda: 1 – caixa/pacote, 2 – rolo/prisma, 3 – envelope.

  @ApiProperty()
  @IsNumber()
  nVlComprimento: number; // Comprimento da encomenda, incluindo embalagem, em centímetros.

  @ApiProperty()
  @IsNumber()
  nVlAltura: number; // Altura da encomenda, incluindo embalagem, em centímetros.

  @ApiProperty()
  @IsNumber()
  nVlLargura: number; // Largura da encomenda, incluindo embalagem, em centímetros.

  @ApiProperty()
  @IsNumber()
  nVlDiametro: number; // Diâmetro da encomenda, incluindo embalagem, em centímetros. Só se for necessário, do contrário informar 0.

  @ApiProperty()
  @IsArray()
  nCdServico: Array<string>; // Código do serviço de frete.
}

export class ShippingPackageBasicDto {
  @ApiProperty()
  @IsNumberString()
  nVlPeso: string; // Peso da encomenda, incluindo sua embalagem, em quilogramas.

  @ApiProperty()
  @IsNumber()
  nVlComprimento: number; // Comprimento da encomenda, incluindo embalagem, em centímetros.

  @ApiProperty()
  @IsNumber()
  nVlAltura: number; // Altura da encomenda, incluindo embalagem, em centímetros.

  @ApiProperty()
  @IsNumber()
  nVlLargura: number; // Largura da encomenda, incluindo embalagem, em centímetros.

  @ApiProperty()
  @IsNumber()
  nVlDiametro: number; // Diâmetro da encomenda, incluindo embalagem, em centímetros. Só se for necessário, do contrário informar 0.
}
