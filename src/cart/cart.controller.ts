import {
  Controller,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Request,
  Delete,
} from '@nestjs/common';
import { ShoppingCartService } from './cart.service';
import { Prisma, ShoppingCart, ShoppingCartItems } from '.prisma/client';
import { AddItemDto } from './dto/add-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: ShoppingCartService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCart(
    @Body() createCartDto: Prisma.ShoppingCartCreateInput,
  ): Promise<ShoppingCart> {
    return await this.cartService.createCart(createCartDto);
  }

  @Post('/add')
  @UsePipes(ValidationPipe)
  async addItem(
    @Request() req,
    @Body() addItemDto: AddItemDto,
  ): Promise<ShoppingCart> {
    return await this.cartService.addItem(req.user.username, addItemDto);
  }

  @Delete('item/:id')
  @UsePipes(ValidationPipe)
  async deleteItem(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShoppingCartItems> {
    return await this.cartService.deleteItem(req.user.username, id);
  }
}
