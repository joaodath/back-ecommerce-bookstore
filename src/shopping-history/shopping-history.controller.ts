import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ShoppingHistoryService } from './shopping-history.service';
import { Prisma, ShoppingHistory } from '.prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Shopping-History')
@Controller('shopping-history')
export class ShoppingHistoryController {
  constructor(
    private readonly shoppingHistoryService: ShoppingHistoryService,
  ) {}

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @ApiOperation({ summary: 'Criar ShoppingHistory' })
  @Post('new')
  @UsePipes(ValidationPipe)
  async create(
    @Body() createShoppingHistoryDto: Prisma.ShoppingHistoryCreateInput,
  ): Promise<ShoppingHistory> {
    return await this.shoppingHistoryService.create(createShoppingHistoryDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Encontrar todos os ShoppingHistory' })
  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<ShoppingHistory[]> {
    return await this.shoppingHistoryService.findAll();
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Encontrar um Livro por ID' })
  @Get('/id/:id')
  @UsePipes(ValidationPipe)
  async findUnique(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShoppingHistory> {
    return await this.shoppingHistoryService.findUnique(id);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Editar informações do ShoppingHistory' })
  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShoppingHistoryDto: Prisma.ShoppingHistoryUpdateInput,
  ): Promise<ShoppingHistory> {
    return await this.shoppingHistoryService.update(
      id,
      updateShoppingHistoryDto,
    );
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Deletar ShoppingHistory' })
  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShoppingHistory> {
    return await this.shoppingHistoryService.remove(id);
  }
}
