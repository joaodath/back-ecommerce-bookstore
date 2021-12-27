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
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateUserCartDto } from './dto/create-user-cart.dto';
import { DeleteItemDto } from './dto/delete-item.dto';
import { GetCartDto } from './dto/get-cart.dto';
import { ShoppingCartToolbelt } from './cart.toolbelt.service';
//import { ShippingPackageDto } from 'src/cep/dto/shipping-package.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    private db: PrismaService,
    private cartItems: ShoppingCartItemsService,
    private book: BooksService,
    private toolbelt: ShoppingCartToolbelt,
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
    /**
     * This method is responsible for creating a new cart for a user.
     * If a registered user already have a cart, it will return the cart.
     * If not, it will create a new cart and return it.
     * Additionally, if the user were previously anonymous, the method will
     * update the previously stored cart with the new items.
     */

    const storedUserCart = await this.toolbelt.findUniqueUserCart(username);
    if (storedUserCart) {
      if (createUserCartDto.cartId) {
        // if there is a cart for the user and a cartId is passed, update the cart

        await this.toolbelt.updateCartOwner(
          storedUserCart.id,
          createUserCartDto.cartId,
        );
        await this.toolbelt.updateTotalCartPrice(storedUserCart.id);
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
        await this.toolbelt.updateCartOwner(
          newUserCart.id,
          createUserCartDto.cartId,
        );
      }

      const shoppingCart = await this.toolbelt.updateTotalCartPrice(
        newUserCart.id,
      );

      return shoppingCart;
    }
  }

  async getCartUser(username: string): Promise<ShoppingCart> {
    const storedShoppingCart = await this.toolbelt.findUniqueUserCart(username);
    if (storedShoppingCart) {
      const shoppingCart = await this.toolbelt.updateTotalCartPrice(
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
        const shoppingCart = await this.toolbelt.updateTotalCartPrice(
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
    const shoppingCart = await this.db.shoppingCart.findUnique({
      where: { username: username },
    });
    addItemDto.shoppingCartId = shoppingCart.id;
    const cartItem = await this.cartItems.findManyBookId(
      addItemDto.shoppingCartId,
      addItemDto.bookId,
    );
    if (cartItem === -1) {
      //if the item does not exist in the cart, create it
      await this.toolbelt.createCartItem(addItemDto);
    } else {
      //if the item exists in the cart, update it
      await this.toolbelt.updateCartItem(addItemDto);
    }
    const updatedCart = await this.toolbelt.updateTotalCartPrice(
      shoppingCart.id,
    );

    return updatedCart;
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
        //if the item does not exist in the cart, create it
        await this.toolbelt.createCartItem(addItemDto);
      } else {
        //if the item exists in the cart, update it
        await this.toolbelt.updateCartItem(addItemDto);
      }
      const updatedCart = await this.toolbelt.updateTotalCartPrice(
        shoppingCart.id,
      );

      return updatedCart;
    } else {
      throw new ConflictException();
    }
  }

  async updateItemUser(
    username: string,
    updateItemDto: UpdateItemDto,
  ): Promise<ShoppingCart> {
    const shoppingCart = await this.db.shoppingCart.findUnique({
      where: { username: username },
    });
    updateItemDto.shoppingCartId = shoppingCart.id;
    const cartItem = await this.cartItems.findUnique(
      updateItemDto.shoppingCartItemId,
    );
    if (cartItem) {
      await this.cartItems.updateItem(updateItemDto);
      const updatedCart = await this.toolbelt.updateTotalCartPrice(
        shoppingCart.id,
      );

      return updatedCart;
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
        await this.cartItems.updateItem(updateItemDto);
        const updatedCart = await this.toolbelt.updateTotalCartPrice(
          shoppingCart.id,
        );

        return updatedCart;
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
      await this.toolbelt.updateTotalCartPrice(shoppingCart.id);
      return await this.toolbelt.findUnique(shoppingCart.id);
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
        await this.toolbelt.updateTotalCartPrice(shoppingCart.id);
        return await this.toolbelt.findUnique(shoppingCart.id);
      }
    } else {
      throw new ConflictException();
    }
  }
}
