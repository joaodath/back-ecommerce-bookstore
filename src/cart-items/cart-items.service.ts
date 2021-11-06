import { Injectable } from '@nestjs/common';
import { Prisma, ShoppingCartItems } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShoppingCartService } from 'src/cart/cart.service';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class ShoppingCartItemsService {
  constructor(
    private db: PrismaService,
    private cart: ShoppingCartService,
    private book: BooksService,
  ) {}

  async createItem(
    createCartItemDto: Prisma.ShoppingCartItemsCreateInput,
  ): Promise<ShoppingCartItems> {
    const bookObject = await this.book.findUnique(createCartItemDto.bookId);
    const bookPrice =
      bookObject.discountCheck === true
        ? bookObject.discountedPrice
        : bookObject.price;

    return await this.db.shoppingCartItems.create({
      data: {
        ...createCartItemDto,
        price: bookPrice,
      },
      shoppingCart: {
        connect: { id: createCartItemDto.shoppingCartId },
      },
      book: {
        connect: { id: createCartItemDto.bookId },
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
