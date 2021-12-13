import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCepDto } from './dto/create-cep.dto';
import { UpdateCepDto } from './dto/update-cep.dto';
import { FindCepDto } from './dto/find-cep-dto';
import { ReturnCepDto } from './dto/return-cep.dto';
import {
  calcularPrecoPrazo,
  consultarCep,
  rastrearEncomendas,
} from 'correios-brasil';
import { ReturnShippingPriceDeliveryDto } from './dto/return-shipping-price-delivery.dto';

@Injectable()
export class CepService {
  async findCEP(cepDto: FindCepDto): Promise<ReturnCepDto> {
    const cepData = await consultarCep(cepDto.cep).then((response) => {
      if (response instanceof Object) {
        return response;
      } else {
        return -1;
      }
    });
    if (cepData === -1) {
      throw new NotFoundException('CEP not found!');
    } else {
      const cepDataClean: ReturnCepDto = {
        cep: cepData.cep,
        logradouro: cepData.logradouro,
        complemento: cepData.complemento,
        bairro: cepData.bairro,
        localidade: cepData.localidade,
        uf: cepData.uf,
      };
      return cepDataClean;
    }
  }

  //async calculateShippingPriceAndDeliveryEstimate(): Promise<ReturnShippingPriceDeliveryDto> {};
}
