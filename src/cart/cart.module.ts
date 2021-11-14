import { Module } from '@nestjs/common';
import { ShoppingCartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShoppingCartItemsService } from 'src/cart-items/cart-items.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartItemsModule } from 'src/cart-items/cart-items.module';
import { BooksService } from 'src/books/books.service';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [PrismaModule, CartItemsModule, BooksModule],
  controllers: [CartController],
  providers: [
    ShoppingCartService,
    PrismaService,
    ShoppingCartItemsService,
    BooksService,
  ],
  exports: [ShoppingCartService],
})
export class CartModule {}
