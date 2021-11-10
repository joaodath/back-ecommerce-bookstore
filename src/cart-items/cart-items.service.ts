import { Injectable } from '@nestjs/common';
import { ShoppingCartItems } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShoppingCartService } from 'src/cart/cart.service';
import { BooksService } from 'src/books/books.service';
import { CreateCartItemsDto } from './dto/create-cart-items.dto';
import { UpdateCartItemsDto } from './dto/update-cart-items.dto';

@Injectable()
export class ShoppingCartItemsService {
  constructor(
    private db: PrismaService,
    private cart: ShoppingCartService,
    private book: BooksService,
  ) {}

  async createItem(
    createCartItemDto: CreateCartItemsDto,
    bookId: number,
  ): Promise<ShoppingCartItems> {
    const bookObject = await this.book.findUnique(bookId);
    const bookPrice =
      bookObject.discountCheck === true
        ? bookObject.discountedPrice
        : bookObject.price;
    const totalPrice = bookPrice * createCartItemDto.quantity;

    return await this.db.shoppingCartItems.create({
      data: {
        ...createCartItemDto,
        price: bookPrice,
        totalPrice: totalPrice,
        shoppingCart: {
          connect: { id: createCartItemDto.shoppingCartId },
        },
        book: {
          connect: { id: bookId },
        },
      },
    });
  }

  async findAll(): Promise<ShoppingCartItems[]> {
    return await this.db.shoppingCartItems.findMany();
  }

  async findMany(
    shoppingCartId: number,
    bookId: number,
  ): Promise<ShoppingCartItems[] | number> {
    const cartItem = await this.db.shoppingCartItems.findMany({
      where: { shoppingCartId: shoppingCartId, bookId: bookId },
    });

    if (cartItem.length !== 0) {
      return cartItem;
    } else {
      return -1;
    }
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
    const cartItem = await this.findMany(
      updateCartItemDto.shoppingCartId,
      updateCartItemDto.bookId,
    );

    if (cartItem !== -1) {
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

  async removeItem(id: number): Promise<ShoppingCartItems> {
    return await this.db.shoppingCartItems.delete({ where: { id } });
  }
}
