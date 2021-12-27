import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShoppingCart } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShoppingCartItemsService } from 'src/cart-items/cart-items.service';
import { BooksService } from 'src/books/books.service';
import { AddItemDto } from './dto/add-item.dto';
import { CreateCartItemsDto } from 'src/cart-items/dto/create-cart-items.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateUserCartDto } from './dto/create-user-cart.dto';
import { DeleteItemDto } from './dto/delete-item.dto';
import { GetCartDto } from './dto/get-cart.dto';
//import { ShippingPackageDto } from 'src/cep/dto/shipping-package.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    private db: PrismaService,
    private cartItems: ShoppingCartItemsService,
    private book: BooksService,
  ) {}

  // toolbelt methods
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
  // end of toolbelt functions

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
    /**
     * This function is responsible for creating a new cart for a user.
     * If a registered user already have a cart, it will return the cart.
     * If not, it will create a new cart and return it.
     * Additionally, if the user were previously anonymous, the function will
     * update the previously stored cart with the new items.
     */

    const storedUserCart = await this.db.shoppingCart.findUnique({
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

    if (storedUserCart) {
      if (createUserCartDto.cartId) {
        // if there is a cart for the user and a cartId is passed, update the cart

        await this.updateCartOwner(storedUserCart.id, createUserCartDto.cartId);
        await this.updateTotalCartPrice(storedUserCart.id);
      } else {
        // if there is a cart for the user and no cartId is passed, return the cart
        return storedUserCart;
      }
    } else {
      // if there is no cart for the user, create a new cart
      const newUserCart = await this.db.shoppingCart.create({
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
        await this.updateCartOwner(newUserCart.id, createUserCartDto.cartId);
      }

      await this.updateTotalCartPrice(newUserCart.id);

      const userCartReady = await this.db.shoppingCart.findUnique({
        where: { id: newUserCart.id },
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
      return userCartReady;
    }
  }

  async getCartUser(username: string): Promise<ShoppingCart> {
    const storedShoppingCart = await this.db.shoppingCart.findUnique({
      where: { username: username },
    });
    if (storedShoppingCart) {
      const shoppingCart = await this.updateTotalCartPrice(
        storedShoppingCart.id,
      );

      return shoppingCart;
    } else {
      throw new NotFoundException();
    }
  }

  async getCartAnon(getCartDto: GetCartDto): Promise<ShoppingCart> {
    const storedShoppingCart = await this.db.shoppingCart.findUnique({
      where: {
        id: getCartDto.shoppingCartId,
      },
    });
    if (storedShoppingCart) {
      if (storedShoppingCart.isAnonymous === true) {
        const shoppingCart = await this.updateTotalCartPrice(
          storedShoppingCart.id,
        );

        return shoppingCart;
      } else {
        throw new ConflictException('Not anonymous');
      }
    } else {
      throw new NotFoundException('ShoppingCart not found!');
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
      await this.updateTotalCartPrice(shoppingCartId.id);
      return this.db.shoppingCart.findUnique({
        where: { id: addItemDto.shoppingCartId },
        include: { shoppingCartItems: true },
      });
    } else {
      const updateCartItem: CreateCartItemsDto = {
        shoppingCartId: addItemDto.shoppingCartId,
        bookId: addItemDto.bookId,
        quantity: addItemDto.quantity,
      };
      const cartUpdate = await this.cartItems.createItem(updateCartItem);
      await this.updateTotalCartPrice(shoppingCartId.id);
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
        await this.updateTotalCartPrice(shoppingCart.id);
        return this.db.shoppingCart.findUnique({
          where: { id: addItemDto.shoppingCartId },
          include: { shoppingCartItems: true },
        });
      } else {
        const updateCartItem: CreateCartItemsDto = {
          shoppingCartId: addItemDto.shoppingCartId,
          bookId: addItemDto.bookId,
          quantity: addItemDto.quantity,
        };
        const cartUpdate = await this.cartItems.createItem(updateCartItem);
        await this.updateTotalCartPrice(shoppingCart.id);
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
      await this.updateTotalCartPrice(shoppingCartId.id);
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
        await this.updateTotalCartPrice(shoppingCart.id);
        return await this.findUnique(updateItemDto.shoppingCartId);
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new ConflictException();
    }
  }

  async deleteItemUser(
    username: string,
    deleteItemDto: DeleteItemDto,
  ): Promise<ShoppingCart> {
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
      await this.cartItems.removeItem(deleteItemDto);
      await this.updateTotalCartPrice(shoppingCart.id);
      return await this.findUnique(shoppingCart.id);
    }
  }

  async deleteItemAnon(deleteItemDto: DeleteItemDto): Promise<ShoppingCart> {
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
        await this.cartItems.removeItem(deleteItemDto);
        await this.updateTotalCartPrice(shoppingCart.id);
        return await this.findUnique(shoppingCart.id);
      }
    } else {
      throw new ConflictException();
    }
  }

  //async createShippingPackage(shoppingCartId: number): Promise<ShippingPackageDto> {};
}
