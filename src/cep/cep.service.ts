import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCepDto } from './dto/create-cep.dto';
import { UpdateCepDto } from './dto/update-cep.dto';
import { FindCepDto } from './dto/find-cep-dto';
import { ReturnCepDto } from './dto/return-cep.dto';
import { FetchCepDto } from './dto/fetch-cep.dto';
import {
  calcularPrecoPrazo,
  consultarCep,
  rastrearEncomendas,
} from 'correios-brasil';

@Injectable()
export class CepService {
  create(createCepDto: CreateCepDto) {
    return 'This action adds a new cep';
  }

  findAll() {
    return `This action returns all cep`;
  }

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

  findOne(id: number) {
    return `This action returns a #${id} cep`;
  }

  update(id: number, updateCepDto: UpdateCepDto) {
    return `This action updates a #${id} cep`;
  }

  remove(id: number) {
    return `This action removes a #${id} cep`;
  }
}
