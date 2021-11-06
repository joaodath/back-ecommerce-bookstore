import { Module } from '@nestjs/common';
import { ShoppingCartItemsService } from './cart-items.service';
import { ShoppingCartItemsController } from './cart-items.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksService } from 'src/books/books.service';
import { ShoppingCartService } from 'src/cart/cart.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShoppingCartItemsController],
  providers: [
    ShoppingCartItemsService,
    PrismaService,
    BooksService,
    ShoppingCartService,
  ],
})
export class CartItemsModule {}
