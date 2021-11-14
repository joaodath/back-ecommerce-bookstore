import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthorService } from 'src/author/author.service';
import { AuthorModule } from 'src/author/author.module';

@Module({
  imports: [PrismaModule, AuthorModule],
  controllers: [BooksController],
  providers: [BooksService, PrismaService, AuthorService],
})
export class BooksModule {}
