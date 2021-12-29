import { Injectable } from '@nestjs/common';
import { ShoppingCartItems } from '@prisma/client';
import { ShoppingCartItemsRepository } from './cart-items.repository';
import { CreateCartItemsDto } from './dto/create-cart-items.dto';

@Injectable()
export class ShoppingCartItemsToolbelt {
  constructor(private repository: ShoppingCartItemsRepository) {}

  async findAll(): Promise<ShoppingCartItems[]> {
    return await this.repository.findAllItems();
  }

  async findMany(shoppingCartId: number): Promise<ShoppingCartItems[]> {
    return await this.repository.findManyItemsId(shoppingCartId);
  }

  async findUnique(id: number): Promise<ShoppingCartItems> {
    return await this.repository.findUniqueItemsId(id);
  }

  async findManyBookId(shoppingCartId: number, bookId: number): Promise<any> {
    //this tries to locate an specific cart item in a given cart
    const cartItem = await this.repository.findManyItemsId(shoppingCartId);

    const cartItemBookId = cartItem.find((item) => item.bookId === bookId);

    if (cartItemBookId) {
      return cartItemBookId;
    } else {
      return -1;
    }
  }

  async createItem(
    data: CreateCartItemsDto,
    price: number,
    totalPrice: number,
  ): Promise<ShoppingCartItems> {
    return await this.repository.createItem(data, price, totalPrice);
  }

  async updateShoppingCartItemOwner(
    cartItemId: number,
    oldShoppingCartId: number,
    newShoppingCartId: number,
  ): Promise<ShoppingCartItems> {
    await this.repository.disconnectShoppingCart(cartItemId, oldShoppingCartId);
    return await this.repository.connectShoppingCart(
      cartItemId,
      newShoppingCartId,
    );
  }

  async updateShoppingCartItem(
    cartItemId: number,
    data: any,
    totalPrice: number,
  ): Promise<ShoppingCartItems> {
    return await this.repository.updateShoppingCartItem(
      cartItemId,
      data,
      totalPrice,
    );
  }

  async deleteItem(id: number): Promise<ShoppingCartItems> {
    return await this.repository.deleteItem(id);
  }
}
