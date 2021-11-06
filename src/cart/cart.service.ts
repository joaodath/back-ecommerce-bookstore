import { Injectable } from '@nestjs/common';
import { Prisma, ShoppingCart } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingCartService {
  constructor(private db: PrismaService) {}

  async createCart(
    createCartDto: Prisma.ShoppingCartCreateInput,
  ): Promise<ShoppingCart> {
    const cartItem = createCartDto.shoppingCartItems.connect;
    const user = createCartDto.user.connect;
    const couponCode = createCartDto.couponCode.connect;

    return await this.db.shoppingCart.create({
      data: {
        ...createCartDto,
        shoppingCartItems: {
          connect: cartItem,
        },
        user: {
          connect: user,
        },
        couponCode: {
          connect: couponCode,
        },
      },
      include: {
        shoppingCartItems: true,
      },
    });
  }

  async updateCart(
    id: number,
    updateCartDto: Prisma.ShoppingCartUpdateInput,
  ): Promise<ShoppingCart> {
    const cartItem = updateCartDto.shoppingCartItems.connect;
    const user = updateCartDto.user.connect;
    const couponCode = updateCartDto.couponCode.connect;

    return await this.db.shoppingCart.update({
      where: { id },
      data: {
        ...updateCartDto,
        shoppingCartItems: {
          connect: cartItem,
        },
        user: {
          connect: user,
        },
        couponCode: {
          connect: couponCode,
        },
      },
      include: {
        shoppingCartItems: true,
      },
    });
  }
}
