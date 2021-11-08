import { Module } from '@nestjs/common';
import { ShoppingHistoryService } from './shopping-history.service';
import { ShoppingHistoryController } from './shopping-history.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShoppingHistoryController],
  providers: [ShoppingHistoryService, PrismaService],
})
export class ShoppingHistoryModule {}
