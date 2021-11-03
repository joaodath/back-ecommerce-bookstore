import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { CartItemsModule } from './cart-items/cart-items.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [UserModule, PrismaModule, CartItemsModule, CartModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
