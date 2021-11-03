import { Module } from '@nestjs/common';
import { ShoppingCartItemsService } from './cart-items.service';
import { ShoppingCartItemsController } from './cart-items.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShoppingCartItemsController],
  providers: [ShoppingCartItemsService, PrismaService],
})
export class CartItemsModule {}
