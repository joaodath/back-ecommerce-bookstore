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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Shopping-History')
@Controller('shopping-history')
export class ShoppingHistoryController {
  constructor(
    private readonly shoppingHistoryService: ShoppingHistoryService,
  ) {}

  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @Post('new')
  @UsePipes(ValidationPipe)
  async create(
    @Body() createShoppingHistoryDto: Prisma.ShoppingHistoryCreateInput,
  ): Promise<ShoppingHistory> {
    return await this.shoppingHistoryService.create(createShoppingHistoryDto);
  }

  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<ShoppingHistory[]> {
    return await this.shoppingHistoryService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('/id/:id')
  @UsePipes(ValidationPipe)
  async findUnique(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShoppingHistory> {
    return await this.shoppingHistoryService.findUnique(id);
  }

  @ApiResponse({ status: 200, description: 'Tudo certo' })
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

  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShoppingHistory> {
    return await this.shoppingHistoryService.remove(id);
  }
}
