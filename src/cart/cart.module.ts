import { Module } from '@nestjs/common';
import { ShoppingCartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  controllers: [CartController],
  providers: [ShoppingCartService],
  exports: [ShoppingCartService],
})
export class CartModule {}
