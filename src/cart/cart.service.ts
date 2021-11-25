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
import { GetCartDto } from './dto/get-cart.dto';
import { ShippingPackageDto } from 'src/cep/dto/shipping-package.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    private db: PrismaService,
    private cartItems: ShoppingCartItemsService,
    private book: BooksService,
  ) {}

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
      include: {
        user: {
          select: {
            name: true,
            username: true,
          },
        },
        couponCode: true,
        shoppingCartItems: true,
      },
    });
    if (isThereACart) {
      if (createUserCartDto.cartId) {
        // if there is a cart for the user and a cartId is passed, update the cart
        const cartItems = await this.cartItems.findMany(
          createUserCartDto.cartId,
        );
        for (const singleCartItem of cartItems) {
          const checkCartItem = await this.findUnique(
            singleCartItem.shoppingCartId,
          );
          if (checkCartItem.isAnonymous === true) {
            await this.cartItems.connectNewOwner(
              singleCartItem.id,
              isThereACart.id,
            );
          }
        }
      } else {
        // if there is a cart for the user and no cartId is passed, return the cart
        return isThereACart;
      }
    } else {
      // if there is no cart for the user, create a new cart
      const newCart = await this.db.shoppingCart.create({
        data: {
          username: username,
          isAnonymous: false,
          user: {
            connect: {
              username: username,
            },
          },
        },
      });

      if (createUserCartDto.cartId) {
        // if there's a cartId, connect the new cart as owner of the cart items
        const cartItems = await this.cartItems.findMany(
          createUserCartDto.cartId,
        );
        for (const singleCartItem of cartItems) {
          const checkCartItem = await this.findUnique(
            singleCartItem.shoppingCartId,
          );
          if (checkCartItem.isAnonymous === true) {
            await this.cartItems.connectNewOwner(singleCartItem.id, newCart.id);
          }
        }
      }

      const userCartReady = await this.db.shoppingCart.findUnique({
        where: { id: newCart.id },
        include: {
          user: {
            select: {
              name: true,
              username: true,
            },
          },
          couponCode: true,
          shoppingCartItems: true,
        },
      });
      console.log(userCartReady);
      return userCartReady;
    }
  }

  async getCartUser(username: string): Promise<ShoppingCart> {
    const shoppingCart = await this.db.shoppingCart.findUnique({
      where: {
        username: username,
      },
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
    if (shoppingCart) {
      return shoppingCart;
    } else {
      throw new NotFoundException();
    }
  }

  async getCartAnon(getCartDto: GetCartDto): Promise<ShoppingCart> {
    const shoppingCart = await this.db.shoppingCart.findUnique({
      where: {
        id: getCartDto.shoppingCartId,
      },
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
    if (shoppingCart) {
      if (shoppingCart.isAnonymous === true) {
        return shoppingCart;
      } else {
        throw new ConflictException('Not anonymous');
      }
    } else {
      throw new NotFoundException();
    }
  }

  async getAllCarts(): Promise<ShoppingCart[]> {
    return await this.db.shoppingCart.findMany();
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
      await this.cartItems.createItem(createCartItemsDto);
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
    if (shoppingCart.isAnonymous === true) {
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
        await this.cartItems.createItem(createCartItemsDto);
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

  //async createShippingPackage(shoppingCartId: number): Promise<ShippingPackageDto> {};
}
