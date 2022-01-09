import { Injectable } from '@nestjs/common';
import { ShoppingCart } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RepositoryService {
  constructor(private db: PrismaService) {}

  //ShoppingCart
  async createAnonShoppingCart(): Promise<ShoppingCart> {
    try {
      return await this.db.shoppingCart.create({
        data: {
          isAnonymous: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async createUserShoppingCart(username: string): Promise<ShoppingCart> {
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
      throw new Error(error);
    }
  }

  async findAllCarts(): Promise<ShoppingCart[]> {
    try {
      return await this.db.shoppingCart.findMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUniqueCartId(cartId: number): Promise<ShoppingCart> {
    try {
      return await this.db.shoppingCart.findUnique({
        where: { id: cartId },
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
          user: {
            select: {
              name: true,
              username: true,
            },
          },
          couponCode: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUniqueUserCart(username: string): Promise<ShoppingCart> {
    try {
      return await this.db.shoppingCart.findUnique({
        where: { username: username },
        include: {
          user: {
            select: {
              name: true,
              username: true,
            },
          },
          couponCode: true,
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
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateShoppingCartTotalPrice(
    shoppingCartId: number,
    totalCartPrice: number,
  ): Promise<ShoppingCart> {
    try {
      return await this.db.shoppingCart.update({
        where: { id: shoppingCartId },
        data: {
          totalPrice: totalCartPrice,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
