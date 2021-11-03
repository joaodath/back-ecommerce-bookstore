import { Injectable } from '@nestjs/common';
import { Prisma, ShoppingCartItems } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingCartItemsService {
  constructor(private db: PrismaService) {}

  async createItem(
    createCartItemDto: Prisma.ShoppingCartItemsCreateInput,
  ): Promise<ShoppingCartItems> {
    return await this.db.shoppingCartItems.create({ data: createCartItemDto });
  }

  async findAll(): Promise<ShoppingCartItems[]> {
    return await this.db.shoppingCartItems.findMany();
  }

  async updateItem(
    id: number,
    updateCartItemDto: Prisma.ShoppingCartItemsUpdateInput,
  ): Promise<ShoppingCartItems> {
    return await this.db.shoppingCartItems.update({
      where: { id },
      data: updateCartItemDto,
    });
  }

  async removeItem(id: number): Promise<ShoppingCartItems> {
    return await this.db.shoppingCartItems.delete({ where: { id } });
  }
}
