import { Injectable } from '@nestjs/common';
import { ShoppingCart, ShoppingCartItems } from '@prisma/client';
import { CreateCartItemsDto } from 'src/cart-items/dto/create-cart-items.dto';
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

  //ShoppingCartItems

  async findAllCartItems(): Promise<ShoppingCartItems[]> {
    try {
      return await this.db.shoppingCartItems.findMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findManyCartItemsWithShoppingCartId(
    shoppingCartId: number,
  ): Promise<ShoppingCartItems[]> {
    try {
      return await this.db.shoppingCartItems.findMany({
        where: { shoppingCartId: shoppingCartId },
        include: {
          book: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUniqueCartItem(cartItemId: number): Promise<ShoppingCartItems> {
    try {
      return await this.db.shoppingCartItems.findUnique({
        where: { id: cartItemId },
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
      throw new Error(error);
    }
  }

  async createCartItem(
    createCartItemsDto: CreateCartItemsDto,
  ): Promise<ShoppingCartItems> {
    try {
      return await this.db.shoppingCartItems.create({
        data: {
          ...createCartItemsDto,
          quantity: createCartItemsDto.quantity,
          price: createCartItemsDto.price,
          totalPrice: createCartItemsDto.totalPrice,
          book: {
            connect: {
              id: createCartItemsDto.bookId,
            },
          },
          shoppingCart: {
            connect: {
              id: createCartItemsDto.shoppingCartId,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateCartItemOwner(
    cartItemId: number,
    oldShoppingCartId: number,
    newShoppingCartId: number,
  ): Promise<ShoppingCartItems> {
    try {
      await this.db.shoppingCartItems.update({
        where: { id: cartItemId },
        data: {
          shoppingCart: {
            disconnect: {
              id: oldShoppingCartId,
            },
          },
        },
      });

      return await this.db.shoppingCartItems.update({
        where: { id: cartItemId },
        data: {
          shoppingCartId: newShoppingCartId,
          shoppingCart: {
            connect: {
              id: newShoppingCartId,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateCartItemQuantityAndPrice(
    cartItemId: number,
    quantity: number,
    totalPrice: number,
    price?: number,
  ): Promise<ShoppingCartItems> {
    try {
      if (price) {
        return await this.db.shoppingCartItems.update({
          where: { id: cartItemId },
          data: {
            quantity: quantity,
            price: price,
            totalPrice: totalPrice,
          },
        });
      } else {
        return await this.db.shoppingCartItems.update({
          where: { id: cartItemId },
          data: {
            quantity: quantity,
            totalPrice: totalPrice,
          },
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeCartItem(cartItemId: number): Promise<ShoppingCartItems> {
    try {
      return await this.db.shoppingCartItems.delete({
        where: { id: cartItemId },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
