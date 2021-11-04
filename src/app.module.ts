import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { BooksModule } from './books/books.module';
import { ShoppingHistoryModule } from './shopping-history/shopping-history.module';

@Module({
  imports: [UserModule, PrismaModule, BooksModule, ShoppingHistoryModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
