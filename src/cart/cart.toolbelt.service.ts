import { Injectable } from '@nestjs/common';
import { ShoppingCart, ShoppingCartItems } from '@prisma/client';
import { BooksService } from 'src/books/books.service';
import { ShoppingCartItemsService } from 'src/cart-items/cart-items.service';
import { CreateCartItemsDto } from 'src/cart-items/dto/create-cart-items.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddItemDto } from './dto/add-item.dto';

@Injectable()
export class ShoppingCartToolbelt {
  constructor(
    private db: PrismaService,
    private cartItems: ShoppingCartItemsService,
    private book: BooksService,
  ) {}

  async findUnique(id: number): Promise<ShoppingCart> {
    return await this.db.shoppingCart.findUnique({
      where: { id: id },
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
        couponCode: {
          select: {
            code: true,
            discountAmount: true,
          },
        },
      },
    });
  }

  async findUniqueUserCart(username: string): Promise<ShoppingCart> {
    return await this.db.shoppingCart.findUnique({
      where: { username: username },
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
        couponCode: {
          select: {
            code: true,
            discountAmount: true,
          },
        },
      },
    });
  }

  async updateTotalCartPrice(shoppingCartId: number): Promise<ShoppingCart> {
    const totalCartPrice = await this.cartItems.calculateTotalPrice(
      shoppingCartId,
    );
    await this.db.shoppingCart.update({
      where: { id: shoppingCartId },
      data: {
        totalPrice: totalCartPrice,
      },
    });

    const updatedCart = await this.findUnique(shoppingCartId);

    return updatedCart;
  }

  async updateCartOwner(userCartId: number, anonymousCartId: number) {
    const cartItems = await this.cartItems.findMany(anonymousCartId);
    for (const singleCartItem of cartItems) {
      const checkCartItem = await this.findUnique(
        singleCartItem.shoppingCartId,
      );
      if (checkCartItem.isAnonymous === true) {
        await this.cartItems.connectNewOwner(singleCartItem.id, userCartId);
      }
    }
  }

  async createCartItem(addItemDto: AddItemDto): Promise<ShoppingCartItems> {
    const book = await this.book.findUnique(addItemDto.bookId);

    const bookPrice =
      book.discountCheck === true ? book.discountedPrice : book.price;

    const createCartItemsDto: CreateCartItemsDto = {
      shoppingCartId: addItemDto.shoppingCartId,
      bookId: addItemDto.bookId,
      price: bookPrice,
      quantity: addItemDto.quantity,
    };
    const createdBook = await this.cartItems.createItem(createCartItemsDto);

    return createdBook;
  }

  async updateCartItem(addItemDto: AddItemDto): Promise<ShoppingCartItems> {
    const updateCartItem: CreateCartItemsDto = {
      shoppingCartId: addItemDto.shoppingCartId,
      bookId: addItemDto.bookId,
      quantity: addItemDto.quantity,
    };
    const updatedBook = await this.cartItems.createItem(updateCartItem);

    return updatedBook;
  }
}
