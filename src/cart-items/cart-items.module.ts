import { Module } from '@nestjs/common';
import { ShoppingCartItemsService } from './cart-items.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksService } from 'src/books/books.service';
import { ShoppingCartService } from 'src/cart/cart.service';
import { BooksModule } from 'src/books/books.module';
import { AuthorModule } from 'src/author/author.module';
import { CategoryModule } from 'src/category/category.module';
import { AuthorService } from 'src/author/author.service';
import { CategoryService } from 'src/category/category.service';
import { PublisherModule } from 'src/publisher/publisher.module';
import { PublisherService } from 'src/publisher/publisher.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { RepositoryService } from 'src/repository/repository.service';

@Module({
  imports: [
    PrismaModule,
    RepositoryModule,
    BooksModule,
    AuthorModule,
    CategoryModule,
    PublisherModule,
  ],
  controllers: [],
  providers: [
    ShoppingCartItemsService,
    PrismaService,
    RepositoryService,
    BooksService,
    ShoppingCartService,
    AuthorService,
    CategoryService,
    PublisherService,
  ],
  exports: [ShoppingCartItemsService],
})
export class CartItemsModule {}
