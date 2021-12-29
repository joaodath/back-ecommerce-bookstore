import { Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingCartItems } from '.prisma/client';
import { BooksService } from 'src/books/books.service';
import { CreateCartItemsDto } from './dto/create-cart-items.dto';
import { UpdateCartItemsDto } from './dto/update-cart-items.dto';
import { DeleteItemDto } from 'src/cart/dto/delete-item.dto';
import { ShoppingCartItemsToolbelt } from './cart-items.toolbelt.service';
import { ShoppingCartToolbelt } from 'src/cart/cart.toolbelt.service';

@Injectable()
export class ShoppingCartItemsService {
  constructor(
    private book: BooksService,
    private toolbelt: ShoppingCartItemsToolbelt,
    private toolbeltCart: ShoppingCartToolbelt,
  ) {}

  async createOrUpdateItem(
    createCartItemDto: CreateCartItemsDto,
  ): Promise<ShoppingCartItems> {
    const doesCartItemExist = await this.toolbelt.findManyBookId(
      createCartItemDto.shoppingCartId,
      createCartItemDto.bookId,
    );
    if (doesCartItemExist !== -1) {
      //if cartItem already exists, update it
      // const newQuantity =
      //   doesCartItemExist.quantity + createCartItemDto.quantity;
      // const newTotalPrice =
      //   doesCartItemExist.totalPrice +
      //   createCartItemDto.quantity * doesCartItemExist.price;
      // return await this.db.shoppingCartItems.update({
      //   where: { id: doesCartItemExist.id },
      //   data: {
      //     quantity: newQuantity,
      //     totalPrice: newTotalPrice,
      //   },
      // });
      const updateItem = await this.updateItem(createCartItemDto);
      if (updateItem === -1) {
        throw new NotFoundException('CartItem does not exist');
      } else {
        return this.toolbelt.findUnique(createCartItemDto.shoppingCartItemId);
      }
    } else {
      //if cartItem do not exists, create it

      const bookObject = await this.book.findUnique(createCartItemDto.bookId);
      if (bookObject) {
        //if book exists, create cartItem
        const bookPrice =
          bookObject.discountCheck === true
            ? bookObject.discountedPrice
            : bookObject.price;
        const totalPrice = bookPrice * createCartItemDto.quantity;

        const cartItemCreated = await this.toolbelt.createItem(
          createCartItemDto,
          bookPrice,
          totalPrice,
        );

        await this.toolbeltCart.updateTotalCartPrice(
          createCartItemDto.shoppingCartId,
        );

        return this.toolbelt.findUnique(cartItemCreated.id);
      } else {
        throw new NotFoundException('Book not found');
      }
    }
  }

  async updateItem(
    updateCartItemDto: UpdateCartItemsDto,
  ): Promise<ShoppingCartItems | number> {
    // const shoppingCart = await this.toolbelt.findUnique(
    //   updateCartItemDto.shoppingCartId,
    // );

    const cartItem = await this.toolbelt.findManyBookId(
      updateCartItemDto.shoppingCartId,
      updateCartItemDto.bookId,
    );
    if (cartItem !== -1) {
      //if the cartItem exists, update it
      const bookObject = await this.book.findUnique(updateCartItemDto.bookId);
      const bookPrice =
        bookObject.discountCheck === true
          ? bookObject.discountedPrice
          : bookObject.price;
      const totalPrice = bookPrice * updateCartItemDto.quantity;
      // const newCartTotalPrice =
      //   shoppingCart.totalPrice + (totalPrice - cartItem.totalPrice);

      updateCartItemDto.shoppingCartId = cartItem.shoppingCartId;
      updateCartItemDto.price = bookPrice;

      await this.toolbelt.updateShoppingCartItem(
        cartItem.id,
        updateCartItemDto,
        totalPrice,
      );

      //shoppingCartUpdate
      /** costumava ser assim:
        await this.db.shoppingCart.update({
        where: { id: updateCartItemDto.shoppingCartId },
        data: {
          totalPrice: newCartTotalPrice,
        },
      });
      */
      await this.toolbeltCart.updateTotalCartPrice(
        updateCartItemDto.shoppingCartId,
      );

      return await this.toolbelt.findUnique(cartItem.id);
    } else {
      return -1;
    }
  }

  async updateItemId(
    updateCartItemDto: UpdateCartItemsDto,
  ): Promise<ShoppingCartItems | number> {
    const cartItem = await this.toolbelt.findUnique(
      updateCartItemDto.shoppingCartItemId,
    );
    const bookObject = await this.book.findUnique(updateCartItemDto.bookId);
    const bookPrice =
      bookObject.discountCheck === true
        ? bookObject.discountedPrice
        : bookObject.price;
    const totalPrice = bookPrice * updateCartItemDto.quantity;

    updateCartItemDto.shoppingCartId = cartItem.shoppingCartId;
    updateCartItemDto.price = bookPrice;

    return await this.toolbelt.updateShoppingCartItem(
      cartItem.id,
      updateCartItemDto,
      totalPrice,
    );
  }

  async connectNewOwner(
    cartItemId: number,
    newShoppingCartId: number,
  ): Promise<ShoppingCartItems> {
    const oldShoppingCart = await this.toolbelt.findUnique(cartItemId);
    return await this.toolbelt.updateShoppingCartItemOwner(
      cartItemId,
      oldShoppingCart.id,
      newShoppingCartId,
    );
  }

  async removeItem(deleteItemDto: DeleteItemDto): Promise<ShoppingCartItems> {
    const cartItem: ShoppingCartItems = await this.toolbelt.findManyBookId(
      deleteItemDto.shoppingCartId,
      deleteItemDto.bookId,
    );
    if (cartItem instanceof Object) {
      return await this.toolbelt.deleteItem(cartItem.id);
    } else {
      throw new NotFoundException();
    }
  }

  async calculateCartTotalPrice(shoppingCartId: number): Promise<number> {
    const cartItems = await this.toolbelt.findMany(shoppingCartId);
    let totalPrice = 0;
    if (cartItems) {
      cartItems.forEach((item) => {
        totalPrice += item.totalPrice;
      });
    }
    return totalPrice;
  }
}
