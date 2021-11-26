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
  @ApiOperation({ summary: 'Cria novo Cep' })
  @Post()
  create(@Body() createCepDto: CreateCepDto) {
    return this.cepService.create(createCepDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Busca todos os Cep' })
  @Get()
  findAll() {
    return this.cepService.findAll();
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Busca Cep pelo ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cepService.findOne(+id);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @ApiOperation({ summary: 'Adiciona rota para cep' })
  @Post('find')
  async findCep(@Body() findCepDto: FindCepDto): Promise<ReturnCepDto> {
    return await this.cepService.findCEP(findCepDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Atualiza Cep' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCepDto: UpdateCepDto) {
    return this.cepService.update(+id, updateCepDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Deleta Cep' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cepService.remove(+id);
  }
}
