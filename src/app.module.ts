import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { BooksModule } from './books/books.module';

@Module({
  imports: [UserModule, PrismaModule, BooksModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
