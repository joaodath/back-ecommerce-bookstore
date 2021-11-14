import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ShoppingCart, ShoppingCartItems } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShoppingCartItemsService } from 'src/cart-items/cart-items.service';
import { BooksService } from 'src/books/books.service';
import { AddItemDto } from './dto/add-item.dto';
import { CreateCartItemsDto } from 'src/cart-items/dto/create-cart-items.dto';
import { UpdateCartItemsDto } from 'src/cart-items/dto/update-cart-items.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateUserCartDto } from './dto/create-user-cart.dto';
import { DeleteItemDto } from './dto/delete-item.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    private db: PrismaService,
    private cartItems: ShoppingCartItemsService,
    private book: BooksService,
  ) {}

  // async createCart(
  //   createCartDto: Prisma.ShoppingCartCreateInput,
  // ): Promise<ShoppingCart> {
  //   if (createCartDto.username) {
  //     const newCart = await this.db.shoppingCart.create({
  //       data: {
  //         ...createCartDto,
  //         isAnonymous: false,
  //       },
  //     });
  //     return await this.db.shoppingCart.update({
  //       where: { id: newCart.id },
  //       data: {
  //         user: {
  //           connect: {
  //             username: createCartDto.username,
  //           },
  //         },
  //       },
  //     });
  //   } else {
  //     return await this.db.shoppingCart.create({
  //       data: { ...createCartDto, isAnonymous: true },
  //     });
  //   }
  // }

  async createAnonCart(): Promise<ShoppingCart> {
    const newCart = await this.db.shoppingCart.create({
      data: {
        isAnonymous: true,
      },
    });
    return newCart;
  }

  async createUserCart(
    username: string,
    createUserCartDto?: CreateUserCartDto,
  ): Promise<ShoppingCart> {
    const isThereACart = await this.db.shoppingCart.findUnique({
      where: { username: username },
    });
    if (isThereACart) {
      if (createUserCartDto.cartId) {
        const cartItems = await this.cartItems.findMany(
          createUserCartDto.cartId,
        );
        for (const singleCartItem of cartItems) {
          await this.cartItems.connectNewOwner(
            singleCartItem.id,
            isThereACart.id,
          );
        }
      } else {
        return isThereACart;
      }
    } else {
      const newCart = await this.db.shoppingCart.create({
        data: {
          isAnonymous: false,
        },
      });
      return await this.db.shoppingCart.update({
        where: { id: newCart.id },
        data: {
          user: {
            connect: {
              username: username,
            },
          },
        },
        include: {
          shoppingCartItems: true,
        },
      });
    }
  }

  async addItemUser(
    username: string,
    addItemDto: AddItemDto,
  ): Promise<ShoppingCart> {
    const shoppingCartId = await this.db.shoppingCart.findUnique({
      where: { username: username },
    });
    addItemDto.shoppingCartId = shoppingCartId.id;
    const cartItem = await this.cartItems.findManyBookId(
      addItemDto.shoppingCartId,
      addItemDto.bookId,
    );
    if (cartItem === -1) {
      const bookObject = await this.book.findUnique(addItemDto.bookId);
      const bookPrice =
        bookObject.discountCheck === true
          ? bookObject.discountedPrice
          : bookObject.price;
      const createCartItemsDto: CreateCartItemsDto = {
        shoppingCartId: addItemDto.shoppingCartId,
        bookId: addItemDto.bookId,
        price: bookPrice,
        quantity: addItemDto.quantity,
      };
      await this.cartItems.createItem(createCartItemsDto, addItemDto.bookId);
      return this.db.shoppingCart.findUnique({
        where: { id: addItemDto.shoppingCartId },
        include: { shoppingCartItems: true },
      });
    } else {
      const updateCartItem: UpdateCartItemsDto = {
        shoppingCartId: addItemDto.shoppingCartId,
        bookId: addItemDto.bookId,
        quantity: addItemDto.quantity,
      };
      const cartUpdate = await this.cartItems.updateItem(updateCartItem);
      return await this.findUnique(addItemDto.shoppingCartId);
    }
  }

  async addItemAnon(addItemDto: AddItemDto): Promise<ShoppingCart> {
    const shoppingCart = await this.db.shoppingCart.findUnique({
      where: { id: addItemDto.shoppingCartId },
    });
    if (shoppingCart.isAnonymous) {
      const cartItem = await this.cartItems.findManyBookId(
        addItemDto.shoppingCartId,
        addItemDto.bookId,
      );
      if (cartItem === -1) {
        const bookObject = await this.book.findUnique(addItemDto.bookId);
        const bookPrice =
          bookObject.discountCheck === true
            ? bookObject.discountedPrice
            : bookObject.price;
        const createCartItemsDto: CreateCartItemsDto = {
          shoppingCartId: addItemDto.shoppingCartId,
          bookId: addItemDto.bookId,
          price: bookPrice,
          quantity: addItemDto.quantity,
        };
        await this.cartItems.createItem(createCartItemsDto, addItemDto.bookId);
        return this.db.shoppingCart.findUnique({
          where: { id: addItemDto.shoppingCartId },
          include: { shoppingCartItems: true },
        });
      } else {
        const updateCartItem: UpdateCartItemsDto = {
          shoppingCartId: addItemDto.shoppingCartId,
          bookId: addItemDto.bookId,
          quantity: addItemDto.quantity,
        };
        const cartUpdate = await this.cartItems.updateItem(updateCartItem);
        return await this.findUnique(addItemDto.shoppingCartId);
      }
    } else {
      throw new ConflictException();
    }
  }

  async updateItemUser(
    username: string,
    updateItemDto: UpdateItemDto,
  ): Promise<ShoppingCart> {
    const shoppingCartId = await this.db.shoppingCart.findUnique({
      where: { username: username },
    });
    updateItemDto.shoppingCartId = shoppingCartId.id;
    const cartItem = await this.cartItems.findUnique(
      updateItemDto.shoppingCartItemId,
    );
    if (cartItem) {
      const updateItem = await this.cartItems.updateItem(updateItemDto);
      return await this.findUnique(updateItemDto.shoppingCartId);
    } else {
      throw new NotFoundException();
    }
  }

  async updateItemAnon(updateItemDto: UpdateItemDto): Promise<ShoppingCart> {
    const shoppingCart = await this.db.shoppingCart.findUnique({
      where: { id: updateItemDto.shoppingCartId },
    });
    if (shoppingCart.isAnonymous === true) {
      const cartItem = await this.cartItems.findUnique(
        updateItemDto.shoppingCartItemId,
      );
      if (cartItem) {
        const updateItem = await this.cartItems.updateItem(updateItemDto);
        return await this.findUnique(updateItemDto.shoppingCartId);
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new ConflictException();
    }
  }

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
      },
    });
  }

  async deleteItemUser(
    username: string,
    deleteItemDto: DeleteItemDto,
  ): Promise<ShoppingCartItems> {
    const shoppingCart = await this.db.shoppingCart.findUnique({
      where: { username: username },
    });
    deleteItemDto.shoppingCartId = shoppingCart.id;
    const cartItem = await this.cartItems.findManyBookId(
      deleteItemDto.shoppingCartId,
      deleteItemDto.bookId,
    );

    if (cartItem === -1) {
      throw new NotFoundException();
    } else {
      return await this.cartItems.removeItem(deleteItemDto.bookId);
    }
  }

  async deleteItemAnon(
    deleteItemDto: DeleteItemDto,
  ): Promise<ShoppingCartItems> {
    const shoppingCart = await this.db.shoppingCart.findUnique({
      where: { id: deleteItemDto.shoppingCartId },
    });
    if (shoppingCart.isAnonymous === true) {
      const cartItem = await this.cartItems.findManyBookId(
        deleteItemDto.shoppingCartId,
        deleteItemDto.bookId,
      );

      if (cartItem === -1) {
        throw new NotFoundException();
      } else {
        return await this.cartItems.removeItem(deleteItemDto.bookId);
      }
    } else {
      throw new ConflictException();
    }
  }
}
