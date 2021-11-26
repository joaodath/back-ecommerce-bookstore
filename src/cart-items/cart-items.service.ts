import { Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingCartItems } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksService } from 'src/books/books.service';
import { CreateCartItemsDto } from './dto/create-cart-items.dto';
import { UpdateCartItemsDto } from './dto/update-cart-items.dto';
import { ShippingPackageBasicDto } from 'src/cep/dto/shipping-package.dto';

@Injectable()
export class ShoppingCartItemsService {
  constructor(private db: PrismaService, private book: BooksService) {}

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
      return await this.db.shoppingCartItems.update({
        where: { id: doesCartItemExist.id },
        data: {
          quantity: newQuantity,
          totalPrice: newTotalPrice,
        },
      });
    }
    const bookObject = await this.book.findUnique(createCartItemDto.bookId);
    if (bookObject) {
      const bookPrice =
        bookObject.discountCheck === true
          ? bookObject.discountedPrice
          : bookObject.price;
      const totalPrice = bookPrice * createCartItemDto.quantity;
      const shoppingCart = await this.db.shoppingCart.findUnique({
        where: { id: createCartItemDto.shoppingCartId },
      });
      const newTotalPrice = shoppingCart.totalPrice + totalPrice;
      const cartItemCreated = await this.db.shoppingCartItems.create({
        data: {
          ...createCartItemDto,
          price: bookPrice,
          totalPrice: totalPrice,
          shoppingCart: {
            connect: { id: createCartItemDto.shoppingCartId },
          },
          book: {
            connect: { id: createCartItemDto.bookId },
          },
        },
      });
      await this.db.shoppingCart.update({
        where: { id: createCartItemDto.shoppingCartId },
        data: {
          totalPrice: newTotalPrice,
        },
      });
      return cartItemCreated;
    } else {
      throw new NotFoundException();
    }
  }

  async findAll(): Promise<ShoppingCartItems[]> {
    return await this.db.shoppingCartItems.findMany();
  }

  findObj(
    array: ShoppingCartItems[],
    id: number,
  ): ShoppingCartItems | undefined {
    return array.find((item) => item.bookId === id);
  }

  async findManyBookId(shoppingCartId: number, bookId: number): Promise<any> {
    const cartItem = await this.db.shoppingCartItems.findMany({
      where: { shoppingCartId: shoppingCartId },
    });
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

  async updateItem(
    updateCartItemDto: UpdateCartItemsDto,
  ): Promise<ShoppingCartItems | number> {
    const cartItem = await this.findManyBookId(
      updateCartItemDto.shoppingCartId,
      updateCartItemDto.bookId,
    );
    const shoppingCart = await this.db.shoppingCart.findUnique({
      where: { id: updateCartItemDto.shoppingCartId },
    });

    if (cartItem !== -1) {
      const bookObject = await this.book.findUnique(updateCartItemDto.bookId);
      const bookPrice =
        bookObject.discountCheck === true
          ? bookObject.discountedPrice
          : bookObject.price;
      const totalPrice = bookPrice * updateCartItemDto.quantity;
      const newCartTotalPrice =
        shoppingCart.totalPrice + totalPrice - cartItem.totalPrice;
      await this.db.shoppingCart.update({
        where: { id: updateCartItemDto.shoppingCartId },
        data: {
          totalPrice: newCartTotalPrice,
        },
      });
      return await this.db.shoppingCartItems.update({
        where: { id: cartItem.id },
        data: {
          ...updateCartItemDto,
          price: bookPrice,
          totalPrice: totalPrice,
        },
      });
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

    return await this.db.shoppingCartItems.update({
      where: { id: cartItem[0].id },
      data: {
        ...updateCartItemDto,
        price: bookPrice,
        totalPrice: totalPrice,
      },
    });
  }

  async connectNewOwner(
    cartItemId: number,
    newShoppingCartId: number,
  ): Promise<ShoppingCartItems> {
    const oldShoppingCart = await this.db.shoppingCartItems.findUnique({
      where: {
        id: cartItemId,
      },
    });
    await this.db.shoppingCartItems.update({
      where: { id: cartItemId },
      data: {
        shoppingCart: {
          disconnect: {
            id: oldShoppingCart.id,
          },
        },
      },
    });
    return await this.db.shoppingCartItems.update({
      where: { id: cartItemId },
      data: {
        shoppingCart: {
          connect: {
            id: newShoppingCartId,
          },
        },
      },
    });
  }

  async removeItem(id: number): Promise<ShoppingCartItems> {
    return await this.db.shoppingCartItems.delete({ where: { id } });
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
