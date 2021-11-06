import { Injectable } from '@nestjs/common';
import { Prisma, ShoppingCartItems } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingCartItemsService {
  constructor(private db: PrismaService) {}

  async createItem(
    createCartItemDto: Prisma.ShoppingCartItemsCreateInput,
  ): Promise<ShoppingCartItems> {
    const shoppingCart = createCartItemDto.shoppingCart.connect;
    const book = createCartItemDto.book.connect;

    return await this.db.shoppingCartItems.create({
      data: {
        ...createCartItemDto,
        shoppingCart: {
          connect: shoppingCart,
        },
        book: {
          connect: book,
        },
      },
    });
  }

  async findAll(): Promise<ShoppingCartItems[]> {
    return await this.db.shoppingCartItems.findMany();
  }

  async updateItem(
    id: number,
    updateCartItemDto: Prisma.ShoppingCartItemsUpdateInput,
  ): Promise<ShoppingCartItems> {
    const shoppingCart = updateCartItemDto.shoppingCart.connect;
    const book = updateCartItemDto.book.connect;

    return await this.db.shoppingCartItems.update({
      where: { id },
      data: {
        ...updateCartItemDto,
        shoppingCart: {
          connect: shoppingCart,
        },
        book: {
          connect: book,
        },
      },
    });
  }

  async removeItem(id: number): Promise<ShoppingCartItems> {
    return await this.db.shoppingCartItems.delete({ where: { id } });
  }
}
