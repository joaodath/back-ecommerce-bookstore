import { Injectable } from '@nestjs/common';
import { Prisma, ShoppingCart } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingCartService {
  constructor(private db: PrismaService) {}

  async createCart(
    createCartDto: Prisma.ShoppingCartCreateInput,
  ): Promise<ShoppingCart> {
    return await this.db.shoppingCart.create({ data: createCartDto });
  }

  async updateCart(
    id: number,
    updateCartDto: Prisma.ShoppingCartUpdateInput,
  ): Promise<ShoppingCart> {
    return await this.db.shoppingCart.update({
      where: { id },
      data: updateCartDto,
    });
  }
}
