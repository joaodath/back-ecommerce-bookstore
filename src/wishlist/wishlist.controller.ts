import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Prisma, WishList } from '.prisma/client';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':username')
  @UsePipes(ValidationPipe)
  async create(
    @Param('username') username: string,
    @Body() createWishlistDto: Prisma.WishListCreateInput,
  ): Promise<WishList> {
    return this.wishlistService.create(username, createWishlistDto);
  }

  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<WishList[]> {
    return this.wishlistService.findAll();
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<WishList> {
    return this.wishlistService.findUnique(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: Prisma.WishListUpdateInput,
  ) {
    return this.wishlistService.update(id, updateWishlistDto);
  }

  @Patch(':username/:wishListId/:bookId')
  @UsePipes(ValidationPipe)
  async addBook(
    @Param('username', 'wishListId', 'bookId') username: string, wishListId: string, bookId: string): Promise<WishList> {
      return this.wishlistService.addBook(username, wishListId, bookId)
    }
  );
  @Delete(':id')
  @UsePipes(ValidationPipe)
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(+id);
  }
}
