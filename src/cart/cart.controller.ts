import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ShoppingCartService } from './cart.service';
import { Prisma, ShoppingCart } from '.prisma/client';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: ShoppingCartService) {}

  @Post('cart')
  @UsePipes(ValidationPipe)
  async createCart(
    @Body() createCartDto: Prisma.ShoppingCartCreateInput,
  ): Promise<ShoppingCart> {
    return await this.cartService.createCart(createCartDto);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async updateCart(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: Prisma.ShoppingCartUpdateInput,
  ): Promise<ShoppingCart> {
    return await this.cartService.updateCart(id, updateCartDto);
  }
}
