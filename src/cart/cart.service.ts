import { Injectable } from '@nestjs/common';
import { Prisma, ShoppingCart } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingCartService {
  constructor(private db: PrismaService) {}

  async createCart(
    createCartDto: Prisma.ShoppingCartCreateInput,
  ): Promise<ShoppingCart> {
    if (createCartDto.userId) {
      const newCart = await this.db.shoppingCart.create({
        data: {
          ...createCartDto,
          isAnonymous: false,
        },
      });
      return await this.db.shoppingCart.update({
        where: { id: newCart.id },
        data: {
          user: {
            connect: {
              id: createCartDto.userId,
            },
          },
        },
      });
    } else {
      return await this.db.shoppingCart.create({
        data: { ...createCartDto, isAnonymous: true },
      });
    }
  }

  async updateCart(
    updateCartDto: Prisma.ShoppingCartUpdateInput,
    id: number,
  ): Promise<ShoppingCart> {
    if (updateCartDto.userId) {
      return await this.db.shoppingCart.update({
        where: { id },
        data: {
          ...updateCartDto,
          isAnonymous: false,
          user: {
            update: {
              where: {
                id: updateCartDto.userId,
              },
            },
          },
        },
      });
    } else {
      return await this.db.shoppingCart.update({
        where: { id },
        data: {
          ...updateCartDto,
          isAnonymous: true,
        },
      });
    }
  }
}
