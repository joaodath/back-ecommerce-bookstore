import { Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingCartItems } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksService } from 'src/books/books.service';
import { CreateCartItemsDto } from './dto/create-cart-items.dto';
import { UpdateCartItemsDto } from './dto/update-cart-items.dto';
//import { ShippingPackageBasicDto } from 'src/cep/dto/shipping-package.dto';
import { DeleteItemDto } from 'src/cart/dto/delete-item.dto';
import { ShoppingCartItemsToolbelt } from './cart-items.toolbelt.service';

@Injectable()
export class ShoppingCartItemsService {
  constructor(
    private db: PrismaService,
    private book: BooksService,
    private toolbelt: ShoppingCartItemsToolbelt,
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
        throw new NotFoundException('Book not found');
      }
    }
  }

  async updateItem(
    updateCartItemDto: UpdateCartItemsDto,
  ): Promise<ShoppingCartItems | number> {
    const shoppingCart = await this.db.shoppingCart.findUnique({
      where: { id: updateCartItemDto.shoppingCartId },
    });

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
      const newCartTotalPrice =
        shoppingCart.totalPrice + (totalPrice - cartItem.totalPrice);
      await this.db.shoppingCart.update({
        where: { id: updateCartItemDto.shoppingCartId },
        data: {
          totalPrice: newCartTotalPrice,
        },
      });
      return await this.db.shoppingCartItems.update({
        where: { id: cartItem.id },
        data: {
          quantity: updateCartItemDto.quantity,
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
    const cartItem = await this.toolbelt.findUnique(
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

  async removeItem(deleteItemDto: DeleteItemDto): Promise<ShoppingCartItems> {
    const cartItem: ShoppingCartItems = await this.toolbelt.findManyBookId(
      deleteItemDto.shoppingCartId,
      deleteItemDto.bookId,
    );
    if (cartItem instanceof Object) {
      return await this.db.shoppingCartItems.delete({
        where: { id: cartItem.id },
      });
    } else {
      throw new NotFoundException();
    }
  }

  async calculateTotalPrice(shoppingCartId: number): Promise<number> {
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
