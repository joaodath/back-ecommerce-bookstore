import { Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingCartItems } from '.prisma/client';
import { BooksService } from 'src/books/books.service';
import { CreateCartItemsDto } from './dto/create-cart-items.dto';
import { UpdateCartItemsDto } from './dto/update-cart-items.dto';
import { ShippingPackageBasicDto } from 'src/cep/dto/shipping-package.dto';
import { DeleteItemDto } from 'src/cart/dto/delete-item.dto';
import { RepositoryService } from 'src/repository/repository.service';

@Injectable()
export class ShoppingCartItemsService {
  constructor(
    private book: BooksService,
    private repository: RepositoryService,
  ) {}

  async createItem(
    createCartItemDto: CreateCartItemsDto,
  ): Promise<ShoppingCartItems> {
    const doesCartItemExist = await this.findManyBookId(
      createCartItemDto.shoppingCartId,
      createCartItemDto.bookId,
    );
    if (doesCartItemExist !== -1) {
      const newQuantity =
        doesCartItemExist.quantity + createCartItemDto.quantity;
      const newTotalPrice =
        doesCartItemExist.totalPrice +
        createCartItemDto.quantity * doesCartItemExist.price;

      return await this.repository.updateCartItemQuantityAndPrice(
        doesCartItemExist.id,
        newQuantity,
        newTotalPrice,
      );
    }
    const bookObject = await this.book.findUnique(createCartItemDto.bookId);
    if (bookObject) {
      const bookPrice =
        bookObject.discountCheck === true
          ? bookObject.discountedPrice
          : bookObject.price;
      const totalPrice = bookPrice * createCartItemDto.quantity;
      const shoppingCart = await this.repository.findUniqueCartId(
        createCartItemDto.shoppingCartId,
      );
      const newTotalPrice = shoppingCart.totalPrice + totalPrice;
      createCartItemDto.price = bookPrice;
      createCartItemDto.totalPrice = totalPrice;
      const cartItemCreated = await this.repository.createCartItem(
        createCartItemDto,
      );
      await this.repository.updateShoppingCartTotalPrice(
        createCartItemDto.shoppingCartId,
        newTotalPrice,
      );
      return cartItemCreated;
    } else {
      throw new NotFoundException();
    }
  }

  async findAll(): Promise<ShoppingCartItems[]> {
    return await this.repository.findAllCartItems();
  }

  findObj(
    array: ShoppingCartItems[],
    id: number,
  ): ShoppingCartItems | undefined {
    return array.find((item) => item.bookId === id);
  }

  async findManyBookId(shoppingCartId: number, bookId: number): Promise<any> {
    const cartItem = await this.repository.findManyCartItemsWithShoppingCartId(
      shoppingCartId,
    );
    console.log('findManyBookId: cartItem');
    console.log(cartItem);

    const cartItemBookId = this.findObj(cartItem, bookId);
    console.log('findManyBookId: cartItemBookId');
    console.log(cartItemBookId);

    if (cartItemBookId) {
      return cartItemBookId;
    } else {
      return -1;
    }
  }

  async findMany(shoppingCartId: number): Promise<ShoppingCartItems[]> {
    return await this.repository.findManyCartItemsWithShoppingCartId(
      shoppingCartId,
    );
  }

  async findUnique(id: number): Promise<ShoppingCartItems> {
    return await this.repository.findUniqueCartItem(id);
  }

  async updateItem(
    updateCartItemDto: UpdateCartItemsDto,
  ): Promise<ShoppingCartItems | number> {
    const cartItem = await this.findManyBookId(
      updateCartItemDto.shoppingCartId,
      updateCartItemDto.bookId,
    );
    const shoppingCart = await this.repository.findUniqueCartId(
      updateCartItemDto.shoppingCartId,
    );

    if (cartItem !== -1) {
      const bookObject = await this.book.findUnique(updateCartItemDto.bookId);
      const bookPrice =
        bookObject.discountCheck === true
          ? bookObject.discountedPrice
          : bookObject.price;
      const totalPrice = bookPrice * updateCartItemDto.quantity;
      const newCartTotalPrice =
        shoppingCart.totalPrice + totalPrice - cartItem.totalPrice;

      await this.repository.updateShoppingCartTotalPrice(
        updateCartItemDto.shoppingCartId,
        newCartTotalPrice,
      );

      return await this.repository.updateCartItemQuantityAndPrice(
        cartItem.id,
        updateCartItemDto.quantity,
        totalPrice,
        bookPrice,
      );
    } else {
      return -1;
    }
  }

  async updateItemId(
    updateCartItemDto: UpdateCartItemsDto,
  ): Promise<ShoppingCartItems | number> {
    const cartItem = await this.findUnique(
      updateCartItemDto.shoppingCartItemId,
    );
    const bookObject = await this.book.findUnique(updateCartItemDto.bookId);
    const bookPrice =
      bookObject.discountCheck === true
        ? bookObject.discountedPrice
        : bookObject.price;
    const totalPrice = bookPrice * updateCartItemDto.quantity;

    return await this.repository.updateCartItemQuantityAndPrice(
      cartItem.id,
      updateCartItemDto.quantity,
      totalPrice,
      bookPrice,
    );
  }

  async connectNewOwner(
    cartItemId: number,
    newShoppingCartId: number,
  ): Promise<ShoppingCartItems> {
    const oldShoppingCart = await this.repository.findUniqueCartItem(
      cartItemId,
    );
    return await this.repository.updateCartItemOwner(
      cartItemId,
      oldShoppingCart.shoppingCartId,
      newShoppingCartId,
    );
  }

  async removeItem(deleteItemDto: DeleteItemDto): Promise<ShoppingCartItems> {
    const cartItem: ShoppingCartItems | number = await this.findManyBookId(
      deleteItemDto.shoppingCartId,
      deleteItemDto.bookId,
    );
    if (cartItem instanceof Object) {
      return await this.repository.removeCartItem(cartItem.id);
    } else {
      throw new NotFoundException();
    }
  }

  async calculateTotalPrice(shoppingCartId: number): Promise<number> {
    const cartItems = await this.findMany(shoppingCartId);
    let totalPrice = 0;
    if (cartItems) {
      cartItems.forEach((item) => {
        totalPrice += item.totalPrice;
      });
    }
    return totalPrice;
  }

  // async createShippingPackage(
  //   shoppingCartId: number,
  // ): Promise<ShippingPackageBasicDto> {
  //   const cartItems = await this.findMany(shoppingCartId);
  //   for (const uniqueCartItem of cartItems) {
  //     const bookId = uniqueCartItem.book.id;
  //   }
  // }
}
