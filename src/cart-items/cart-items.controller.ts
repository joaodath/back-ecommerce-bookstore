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
import { ShoppingCartItemsService } from './cart-items.service';
import { Prisma, ShoppingCartItems } from '.prisma/client';

@Controller('cart-items')
export class ShoppingCartItemsController {
  constructor(private readonly cartItemsService: ShoppingCartItemsService) {}

  @Post('newItem')
  @UsePipes(ValidationPipe)
  async createItem(
    @Body() createCartItemDto: Prisma.ShoppingCartItemsCreateInput,
  ): Promise<ShoppingCartItems> {
    return await this.cartItemsService.createItem(createCartItemDto);
  }

  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<ShoppingCartItems[]> {
    return await this.cartItemsService.findAll();
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: Prisma.ShoppingCartItemsUpdateInput,
  ): Promise<ShoppingCartItems> {
    return await this.cartItemsService.updateItem(id, updateItemDto);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShoppingCartItems> {
    return await this.cartItemsService.removeItem(id);
  }
}
