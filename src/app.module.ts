import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CartItemsModule } from './cart-items/cart-items.module';
import { CartModule } from './cart/cart.module';
import { BooksModule } from './books/books.module';
import { ShoppingHistoryModule } from './shopping-history/shopping-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    BooksModule,
    ShoppingHistoryModule,
    CartItemsModule,
    CartModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
