import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublisherModule } from 'src/publisher/publisher.module';
import { PublisherService } from 'src/publisher/publisher.service';
import { CategoryService } from 'src/category/category.service';
import { CategoryModule } from 'src/category/category.module';
import { AuthorService } from 'src/author/author.service';
import { AuthorModule } from 'src/author/author.module';

@Module({
  imports: [PrismaModule, AuthorModule, CategoryModule, PublisherModule],
  controllers: [BooksController],
  providers: [
    BooksService,
    PrismaService,
    AuthorService,
    CategoryService,
    PublisherService,
  ],
})
export class BooksModule {}
