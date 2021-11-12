import { Module } from '@nestjs/common';
import { ShoppingCartItemsService } from './cart-items.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksService } from 'src/books/books.service';
import { ShoppingCartService } from 'src/cart/cart.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    ShoppingCartItemsService,
    PrismaService,
    BooksService,
    ShoppingCartService,
  ],
})
export class CartItemsModule {}
