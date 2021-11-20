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

@Controller('cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Post()
  create(@Body() createCepDto: CreateCepDto) {
    return this.cepService.create(createCepDto);
  }

  @Get()
  findAll() {
    return this.cepService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cepService.findOne(+id);
  }

  @Post('find')
  async findCep(@Body() findCepDto: FindCepDto): Promise<ReturnCepDto> {
    return await this.cepService.findCEP(findCepDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCepDto: UpdateCepDto) {
    return this.cepService.update(+id, updateCepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cepService.remove(+id);
  }
}
