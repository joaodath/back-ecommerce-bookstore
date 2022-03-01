import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShoppingCart, ShoppingCartItems } from '.prisma/client';
import { ShoppingCartItemsService } from 'src/cart-items/cart-items.service';
import { BooksService } from 'src/books/books.service';
import { AddItemDto } from './dto/add-item.dto';
import { CreateCartItemsDto } from 'src/cart-items/dto/create-cart-items.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateUserCartDto } from './dto/create-user-cart.dto';
import { DeleteItemDto } from './dto/delete-item.dto';
import { GetCartDto } from './dto/get-cart.dto';
import { RepositoryService } from 'src/repository/repository.service';

@Injectable()
export class ShoppingCartService {
  constructor(
    private repository: RepositoryService,
    private cartItems: ShoppingCartItemsService,
    private book: BooksService,
  ) {}

  async updateTotalCartPrice(shoppingCartId: number): Promise<ShoppingCart> {
    const totalCartPrice = await this.cartItems.calculateTotalPrice(
      shoppingCartId,
    );
    const cartUpdated = await this.repository.updateShoppingCartTotalPrice(
      shoppingCartId,
      totalCartPrice,
    );
    return cartUpdated;
  }

  async connectNewOwner(
    cartId: number,
    newOwnerCartId: number,
  ): Promise<boolean> {
    // TODO: Essa forma de conectar o novo dono do carrinho não está funcionando 100%. Deve atualizar o item do carrinho do usuário com o item e quantidade do carrinho anônimo e deletar o carrinho anônimo.
    // if there is a cart for the user and a cartId is passed, update the cart with the items from the cartId passed
    try {
      const cartItems = await this.cartItems.findMany(cartId);
      if (!cartItems) {
        throw new NotFoundException('Cart not found!');
      }

      for (const singleCartItem of cartItems) {
        const checkCartItem = await this.findUnique(
          singleCartItem.shoppingCartId,
        );
        if (checkCartItem.isAnonymous === true) {
          await this.cartItems.connectNewOwner(
            singleCartItem.id,
            newOwnerCartId,
          );
        }
      }
      await this.updateTotalCartPrice(newOwnerCartId);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createAnonCart(): Promise<ShoppingCart> {
    return await this.repository.createAnonShoppingCart();
  }

  async createUserCart(
    username: string,
    createUserCartDto?: CreateUserCartDto,
  ): Promise<ShoppingCart> {
    const isThereACart = await this.repository.findUniqueUserCart(username);
    if (isThereACart) {
      if (createUserCartDto.shoppingCartId) {
        // if there is a cart for the user and a cartId is passed, update the cart with the items from the cartId passed
        // // const cartItems = await this.cartItems.findMany(
        // //   createUserCartDto.cartId,
        // // );
        // // for (const singleCartItem of cartItems) {
        // //   const checkCartItem = await this.findUnique(
        // //     singleCartItem.shoppingCartId,
        // //   );
        // //   if (checkCartItem.isAnonymous === true) {
        // //     await this.cartItems.connectNewOwner(
        // //       singleCartItem.id,
        // //       isThereACart.id,
        // //     );
        // //   }
        // // }
        // // await this.updateTotalCartPrice(isThereACart.id);
        await this.connectNewOwner(
          createUserCartDto.shoppingCartId,
          isThereACart.id,
        );
        return await this.repository.findUniqueCartId(isThereACart.id);
      } else {
        // if there is a cart for the user and no cartId is passed, return the cart
        return isThereACart;
      }
    } else {
      // if there is no cart for the user, create a new cart
      const newCart = await this.repository.createUserShoppingCart(username);

      if (createUserCartDto.shoppingCartId) {
        // if there's a cartId, connect the new user cart as owner of the cart items
        // // const cartItems = await this.cartItems.findMany(
        // //   createUserCartDto.cartId,
        // // );
        // // for (const singleCartItem of cartItems) {
        // //   const checkCartItem = await this.findUnique(
        // //     singleCartItem.shoppingCartId,
        // //   );
        // //   if (checkCartItem.isAnonymous === true) {
        // //     await this.cartItems.connectNewOwner(singleCartItem.id, newCart.id);
        // //   }
        // // }
        // // await this.updateTotalCartPrice(newCart.id);
        await this.connectNewOwner(
          createUserCartDto.shoppingCartId,
          newCart.id,
        );
      }
      return await this.repository.findUniqueCartId(newCart.id);
    }
  }

  async getUserCart(username: string): Promise<ShoppingCart> {
    const isShoppingCart = await this.repository.findUniqueUserCart(username);
    if (isShoppingCart) {
      await this.updateTotalCartPrice(isShoppingCart.id);
      return await this.repository.findUniqueUserCart(username);
    } else {
      throw new NotFoundException();
    }
  }

  async getAnonCart(getCartDto: GetCartDto): Promise<ShoppingCart> {
    const isShoppingCart = await this.repository.findUniqueCartId(
      getCartDto.shoppingCartId,
    );
    if (isShoppingCart) {
      if (isShoppingCart.isAnonymous === true) {
        await this.updateTotalCartPrice(isShoppingCart.id);
        return await this.repository.findUniqueCartId(
          getCartDto.shoppingCartId,
        );
      } else {
        throw new ConflictException('Not anonymous');
      }
    } else {
      throw new NotFoundException('ShoppingCart not found!');
    }
  }

  async getAllCarts(): Promise<ShoppingCart[]> {
    return await this.repository.findAllCarts();
  }

  async addItemUser(
    username: string,
    addItemDto: AddItemDto,
  ): Promise<ShoppingCart> {
    const shoppingCartId = await this.repository.findUniqueUserCart(username);
    addItemDto.shoppingCartId = shoppingCartId.id;
    const cartItem = await this.cartItems.findManyBookId(
      shoppingCartId.id,
      addItemDto.bookId,
    );
    if (cartItem === -1) {
      const bookObject = await this.book.findUnique(addItemDto.bookId);
      const bookPrice =
        bookObject.discountCheck === true
          ? bookObject.discountedPrice
          : bookObject.price;
      const createCartItemsDto: CreateCartItemsDto = {
        shoppingCartId: shoppingCartId.id,
        bookId: addItemDto.bookId,
        price: bookPrice,
        quantity: addItemDto.quantity,
      };
      await this.cartItems.createItem(createCartItemsDto);
      await this.updateTotalCartPrice(shoppingCartId.id);
      return this.repository.findUniqueUserCart(username);
    } else {
      const updateCartItem: CreateCartItemsDto = {
        shoppingCartId: shoppingCartId.id,
        bookId: addItemDto.bookId,
        quantity: addItemDto.quantity,
      };
      await this.cartItems.createItem(updateCartItem);
      await this.updateTotalCartPrice(shoppingCartId.id);
      return await this.findUnique(addItemDto.shoppingCartId);
    }
  }

  async addItemAnon(addItemDto: AddItemDto): Promise<ShoppingCart> {
    const shoppingCart = await this.repository.findUniqueCartId(
      addItemDto.shoppingCartId,
    );
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
        return await this.repository.findUniqueCartId(
          addItemDto.shoppingCartId,
        );
      } else {
        const updateCartItem: CreateCartItemsDto = {
          shoppingCartId: addItemDto.shoppingCartId,
          bookId: addItemDto.bookId,
          quantity: addItemDto.quantity,
        };
        await this.cartItems.createItem(updateCartItem);
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
    const shoppingCartId = await this.repository.findUniqueUserCart(username);
    updateItemDto.shoppingCartId = shoppingCartId.id;
    const cartItem = await this.cartItems.findUnique(
      updateItemDto.shoppingCartItemId,
    );
    if (cartItem) {
      await this.cartItems.updateItem(updateItemDto);
      await this.updateTotalCartPrice(shoppingCartId.id);
      return await this.findUnique(shoppingCartId.id);
    } else {
      throw new NotFoundException('Item not found on this shopping cart!');
    }
  }

  async updateItemAnon(updateItemDto: UpdateItemDto): Promise<ShoppingCart> {
    const shoppingCart = await this.repository.findUniqueCartId(
      updateItemDto.shoppingCartId,
    );
    if (shoppingCart.isAnonymous === true) {
      const cartItem = await this.cartItems.findUnique(
        updateItemDto.shoppingCartItemId,
      );
      if (cartItem) {
        await this.cartItems.updateItem(updateItemDto);
        await this.updateTotalCartPrice(shoppingCart.id);
        return await this.findUnique(shoppingCart.id);
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new ConflictException();
    }
  }

  async findUnique(id: number): Promise<ShoppingCart> {
    return await this.repository.findUniqueCartId(id);
  }

  async deleteItemUser(
    username: string,
    deleteItemDto: DeleteItemDto,
  ): Promise<ShoppingCart> {
    const shoppingCart = await this.repository.findUniqueUserCart(username);
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
    const shoppingCart = await this.repository.findUniqueCartId(
      deleteItemDto.shoppingCartId,
    );
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
