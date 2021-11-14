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
  UseGuards,
} from '@nestjs/common';
import { ShoppingCartService } from './cart.service';
import { Prisma, ShoppingCart, ShoppingCartItems } from '.prisma/client';
import { AddItemDto } from './dto/add-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserCartDto } from './dto/create-user-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: ShoppingCartService) {}

  // @Post()
  // @UsePipes(ValidationPipe)
  // async createCart(
  //   @Body() createCartDto: Prisma.ShoppingCartCreateInput,
  // ): Promise<ShoppingCart> {
  //   return await this.cartService.createCart(createCartDto);
  // }

  @Post('new/anon')
  @UsePipes(ValidationPipe)
  async createAnonCart(): Promise<ShoppingCart> {
    return await this.cartService.createAnonCart();
  }

  @Post('new/user')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async createUserCart(
    @Request() req,
    @Body() createUserCartDto: CreateUserCartDto,
  ): Promise<ShoppingCart> {
    return await this.cartService.createUserCart(
      req.user.username,
      createUserCartDto,
    );
  }

  @Post('user/item/add')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async addItemUser(
    @Request() req,
    @Body() addItemDto: AddItemDto,
  ): Promise<ShoppingCart> {
    return await this.cartService.addItemUser(req.user.username, addItemDto);
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
