import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CepService } from './cep.service';
import { CreateCepDto } from './dto/create-cep.dto';
import { FindCepDto } from './dto/find-cep-dto';
import { ReturnCepDto } from './dto/return-cep.dto';
import { UpdateCepDto } from './dto/update-cep.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Cep')
@Controller('cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @ApiOperation({ summary: 'Adiciona rota para cep' })
  @Post('find')
  async findCep(@Body() findCepDto: FindCepDto): Promise<ReturnCepDto> {
    return await this.cepService.findCEP(findCepDto);
  }
}
