import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryService } from 'src/category/category.service';
import { CategoryModule } from 'src/category/category.module';
import { AuthorService } from 'src/author/author.service';
import { AuthorModule } from 'src/author/author.module';

@Module({
  imports: [PrismaModule, AuthorModule, CategoryModule],
  controllers: [BooksController],
  providers: [BooksService, PrismaService, AuthorService, CategoryService],
})
export class BooksModule {}
