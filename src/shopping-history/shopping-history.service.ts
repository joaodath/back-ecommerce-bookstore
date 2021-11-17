import { Injectable } from '@nestjs/common';
import { Prisma, ShoppingHistory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingHistoryService {
  constructor(private db: PrismaService) {}

  async create(
    createShoppingHistoryDto: Prisma.ShoppingHistoryCreateInput,
  ): Promise<ShoppingHistory> {
    return await this.db.shoppingHistory.create({
      data: createShoppingHistoryDto,
    });
  }

  async findAll(): Promise<ShoppingHistory[]> {
    return await this.db.shoppingHistory.findMany();
  }

  async findUnique(id: number): Promise<ShoppingHistory> {
    return await this.db.shoppingHistory.findUnique({ where: { id } });
  }

  async update(
    id: number,
    updateShoppingHistoryDto: Prisma.ShoppingHistoryUpdateInput,
  ): Promise<ShoppingHistory> {
    return await this.db.shoppingHistory.update({
      where: { id },
      data: updateShoppingHistoryDto,
    });
  }
  async remove(id: number): Promise<ShoppingHistory> {
    return await this.db.shoppingHistory.delete({ where: { id } });
  }
}
