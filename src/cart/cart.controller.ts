import {
  Controller,
  Get,
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
import { GetCartDto } from './dto/get-cart.dto';
import { ApiTags, ApiHeader, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Cart')
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

  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Token',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito de dados. Revise dados enviados.',
  })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Pega o Carrinho de Usuário' })
  @Get('user')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getCartUser(@Request() req): Promise<ShoppingCart> {
    return await this.cartService.getCartUser(req.user.username);
  }

  @Get('all')
  @UsePipes(ValidationPipe)
  async getAllCarts(): Promise<ShoppingCart[]> {
    return await this.cartService.getAllCarts();
  }

  @ApiResponse({
    status: 409,
    description: 'Conflito de dados. Revise dados enviados.',
  })
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @ApiOperation({ summary: 'Cria Carrinho Anônimo' })
  @Post('anon')
  @UsePipes(ValidationPipe)
  async getCartAnon(@Body() getCartDto: GetCartDto): Promise<ShoppingCart> {
    return await this.cartService.getCartAnon(getCartDto);
  }

  @ApiResponse({
    status: 409,
    description: 'Conflito de dados. Revise dados enviados.',
  })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Busca o Carrinho Anônimo' })
  @Get('new/anon')
  @UsePipes(ValidationPipe)
  async createAnonCart(): Promise<ShoppingCart> {
    return await this.cartService.createAnonCart();
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Token',
  })
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @ApiOperation({ summary: 'Cria carrinho de usuário' })
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

  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Token',
  })
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @ApiOperation({ summary: 'Adiciona item ao carrinho do usuário' })
  @Post('user/item/add')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async addItemUser(
    @Request() req,
    @Body() addItemDto: AddItemDto,
  ): Promise<ShoppingCart> {
    return await this.cartService.addItemUser(req.user.username, addItemDto);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Token',
  })
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Atualiza item do carrinho do usuário' })
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

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @ApiOperation({ summary: 'Adicionar item no carrinho anónimo' })
  @Post('anon/item/add')
  @UsePipes(ValidationPipe)
  async addItemAnon(@Body() addItemDto: AddItemDto): Promise<ShoppingCart> {
    return await this.cartService.addItemAnon(addItemDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito de dados. Revise dados enviados.',
  })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Atualizar item no carrinho anónimo' })
  @Patch('anon/item/update')
  @UsePipes(ValidationPipe)
  async updateItemAnon(
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ShoppingCart> {
    return await this.cartService.updateItemAnon(updateItemDto);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Token',
  })
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Deletar item do carrinho do usuário' })
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

  @ApiResponse({
    status: 409,
    description: 'Conflito de dados. Revise dados enviados.',
  })
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiOperation({ summary: 'Deletar item do carrinho anónimo' })
  @Delete('anon/item/delete')
  @UsePipes(ValidationPipe)
  async deleteItemAnon(
    @Body() deleteItemDto: DeleteItemDto,
  ): Promise<ShoppingCartItems> {
    return await this.cartService.deleteItemAnon(deleteItemDto);
  }
}
