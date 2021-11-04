import { Module } from '@nestjs/common';
import { ShoppingHistoryService } from './shopping-history.service';
import { ShoppingHistoryController } from './shopping-history.controller';

@Module({
  controllers: [ShoppingHistoryController],
  providers: [ShoppingHistoryService]
})
export class ShoppingHistoryModule {}
