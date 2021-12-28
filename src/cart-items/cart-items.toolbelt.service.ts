import { Injectable } from '@nestjs/common';
import { ShoppingCartItems } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingCartItemsToolbelt {
  constructor(private db: PrismaService) {}

  async findAll(): Promise<ShoppingCartItems[]> {
    return await this.db.shoppingCartItems.findMany();
  }

  async findMany(shoppingCartId: number): Promise<ShoppingCartItems[]> {
    return await this.db.shoppingCartItems.findMany({
      where: { shoppingCartId: shoppingCartId },
      include: {
        book: true,
      },
    });
  }

  async findUnique(id: number): Promise<ShoppingCartItems> {
    return await this.db.shoppingCartItems.findUnique({
      where: { id: id },
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
    });
  }

  async findManyBookId(shoppingCartId: number, bookId: number): Promise<any> {
    //this tries to locate an specific cart item in a given cart
    const cartItem = await this.db.shoppingCartItems.findMany({
      where: { shoppingCartId: shoppingCartId },
    });

    const cartItemBookId = cartItem.find((item) => item.bookId === bookId);

    if (cartItemBookId) {
      return cartItemBookId;
    } else {
      return -1;
    }
  }
}
