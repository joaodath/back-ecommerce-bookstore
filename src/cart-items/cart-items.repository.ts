import { Injectable } from '@nestjs/common';
import { ShoppingCartItems } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartItemsDto } from './dto/create-cart-items.dto';

@Injectable()
export class ShoppingCartItemsRepository {
  constructor(private db: PrismaService) {}

  async findAllItems(): Promise<ShoppingCartItems[]> {
    try {
      return await this.db.shoppingCartItems.findMany();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async findManyItemsId(shoppingCartId: number): Promise<ShoppingCartItems[]> {
    try {
      return await this.db.shoppingCartItems.findMany({
        where: { shoppingCartId: shoppingCartId },
        include: {
          book: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async findUniqueItemsId(id: number): Promise<ShoppingCartItems> {
    try {
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
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async createItem(
    data: CreateCartItemsDto,
    price: number,
    totalPrice: number,
  ): Promise<ShoppingCartItems> {
    try {
      return await this.db.shoppingCartItems.create({
        data: {
          ...data,
          price: price,
          totalPrice: totalPrice,
          shoppingCart: {
            connect: { id: data.shoppingCartId },
          },
          book: {
            connect: { id: data.bookId },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async connectShoppingCart(
    cartItemId: number,
    shoppingCartId: number,
  ): Promise<ShoppingCartItems> {
    try {
      return await this.db.shoppingCartItems.update({
        where: { id: cartItemId },
        data: {
          shoppingCart: {
            connect: {
              id: shoppingCartId,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async disconnectShoppingCart(
    cartItemId: number,
    shoppingCartId: number,
  ): Promise<ShoppingCartItems> {
    try {
      return await this.db.shoppingCartItems.update({
        where: { id: cartItemId },
        data: {
          shoppingCart: {
            disconnect: {
              id: shoppingCartId,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async updateShoppingCartItem(
    cartItemId: number,
    data: any,
    totalPrice: number,
  ): Promise<ShoppingCartItems> {
    try {
      return await this.db.shoppingCartItems.update({
        where: { id: cartItemId },
        data: {
          ...data,
          totalPrice: totalPrice,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async deleteItem(id: number): Promise<ShoppingCartItems> {
    try {
      return await this.db.shoppingCartItems.delete({
        where: { id: id },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
