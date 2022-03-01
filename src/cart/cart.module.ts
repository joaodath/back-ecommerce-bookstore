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
import { RepositoryModule } from 'src/repository/repository.module';
import { RepositoryService } from 'src/repository/repository.service';

@Module({
  imports: [
    PrismaModule,
    RepositoryModule,
    CartItemsModule,
    BooksModule,
    AuthorModule,
    CategoryModule,
    PublisherModule,
  ],
  controllers: [CartController],
  providers: [
    ShoppingCartService,
    PrismaService,
    RepositoryService,
    ShoppingCartItemsService,
    BooksService,
    AuthorService,
    CategoryService,
    PublisherService,
  ],
  exports: [ShoppingCartService],
})
export class CartModule {}
