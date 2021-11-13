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

@Controller('shopping-history')
export class ShoppingHistoryController {
  constructor(
    private readonly shoppingHistoryService: ShoppingHistoryService,
  ) {}

  @Post('new')
  @UsePipes(ValidationPipe)
  async create(
    @Body() createShoppingHistoryDto: Prisma.ShoppingHistoryCreateInput,
  ): Promise<ShoppingHistory> {
    return await this.shoppingHistoryService.create(createShoppingHistoryDto);
  }

  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<ShoppingHistory[]> {
    return await this.shoppingHistoryService.findAll();
  }

  @Get('/id/:id')
  @UsePipes(ValidationPipe)
  async findUnique(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShoppingHistory> {
    return await this.shoppingHistoryService.findUnique(id);
  }

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

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShoppingHistory> {
    return await this.shoppingHistoryService.remove(id);
  }
}
