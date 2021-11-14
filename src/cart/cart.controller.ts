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
  Patch,
} from '@nestjs/common';
import { ShoppingCartService } from './cart.service';
import { Prisma, ShoppingCart, ShoppingCartItems } from '.prisma/client';
import { AddItemDto } from './dto/add-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserCartDto } from './dto/create-user-cart.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { DeleteItemDto } from './dto/delete-item.dto';

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

  @Patch('user/item/update')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async updateItemUser(
    @Request() req,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ShoppingCart> {
    return await this.cartService.updateItemUser(
      req.user.username,
      updateItemDto,
    );
  }

  @Post('anon/item/add')
  @UsePipes(ValidationPipe)
  async addItemAnon(@Body() addItemDto: AddItemDto): Promise<ShoppingCart> {
    return await this.cartService.addItemAnon(addItemDto);
  }

  @Patch('anon/item/update')
  @UsePipes(ValidationPipe)
  async updateItemAnon(
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ShoppingCart> {
    return await this.cartService.updateItemAnon(updateItemDto);
  }

  @Delete('user/item/delete')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async deleteItemUser(
    @Request() req,
    @Body() deleteItemDto: DeleteItemDto,
  ): Promise<ShoppingCartItems> {
    return await this.cartService.deleteItemUser(
      req.user.username,
      deleteItemDto,
    );
  }

  @Delete('anon/item/delete')
  @UsePipes(ValidationPipe)
  async deleteItemAnon(
    @Body() deleteItemDto: DeleteItemDto,
  ): Promise<ShoppingCartItems> {
    return await this.cartService.deleteItemAnon(deleteItemDto);
  }
}
