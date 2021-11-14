import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublisherModule } from 'src/publisher/publisher.module';
import { PublisherService } from 'src/publisher/publisher.service';

@Module({
  imports: [PrismaModule, PublisherModule],
  controllers: [BooksController],
  providers: [BooksService, PrismaService, PublisherService],
})
export class BooksModule {}
