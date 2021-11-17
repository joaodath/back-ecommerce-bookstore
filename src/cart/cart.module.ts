import { Module } from '@nestjs/common';
import { ShoppingCartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShoppingCartItemsService } from 'src/cart-items/cart-items.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartItemsModule } from 'src/cart-items/cart-items.module';
import { BooksService } from 'src/books/books.service';
import { BooksModule } from 'src/books/books.module';
import { AuthorService } from 'src/author/author.service';
import { AuthorModule } from 'src/author/author.module';
import { CategoryModule } from 'src/category/category.module';
import { CategoryService } from 'src/category/category.service';
import { PublisherModule } from 'src/publisher/publisher.module';
import { PublisherService } from 'src/publisher/publisher.service';
import { CouponCodesModule } from 'src/coupon-codes/coupon-codes.module';
import { CouponCodesService } from 'src/coupon-codes/coupon-codes.service';

@Module({
  imports: [
    PrismaModule,
    CartItemsModule,
    BooksModule,
    AuthorModule,
    CategoryModule,
    PublisherModule,
    CouponCodesModule,
  ],
  controllers: [CartController],
  providers: [
    ShoppingCartService,
    PrismaService,
    ShoppingCartItemsService,
    BooksService,
    AuthorService,
    CategoryService,
    PublisherService,
    CouponCodesService,
  ],
  exports: [ShoppingCartService],
})
export class CartModule {}
