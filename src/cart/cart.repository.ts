import { Injectable } from '@nestjs/common';
import { ShoppingCart } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingCartRepository {
  constructor(private db: PrismaService) {}

  async findUniqueId(id: number): Promise<ShoppingCart> {
    try {
      return await this.db.shoppingCart.findUnique({
        where: { id: id },
        include: {
          shoppingCartItems: {
            include: {
              book: {
                select: {
                  title: true,
                  author: true,
                  publisher: true,
                  coverImg: true,
                },
              },
            },
          },
          couponCode: {
            select: {
              code: true,
              discountAmount: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async findUniqueUserCart(username: string): Promise<ShoppingCart> {
    try {
      return await this.db.shoppingCart.findUnique({
        where: { username: username },
        include: {
          shoppingCartItems: {
            include: {
              book: {
                select: {
                  title: true,
                  author: true,
                  publisher: true,
                  coverImg: true,
                },
              },
            },
          },
          couponCode: {
            select: {
              code: true,
              discountAmount: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async findManyCarts(): Promise<ShoppingCart[]> {
    try {
      return await this.db.shoppingCart.findMany();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async createAnonCart(): Promise<ShoppingCart> {
    try {
      return await this.db.shoppingCart.create({
        data: {
          isAnonymous: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async createUserCart(username: string): Promise<ShoppingCart> {
    try {
      return await this.db.shoppingCart.create({
        data: {
          username: username,
          isAnonymous: false,
          user: {
            connect: {
              username: username,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async updateShoppingCartTotalPrice(
    shoppingCartId: number,
    totalCartPrice: any,
  ): Promise<ShoppingCart> {
    try {
      return await this.db.shoppingCart.update({
        where: { id: shoppingCartId },
        data: {
          totalPrice: totalCartPrice,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
