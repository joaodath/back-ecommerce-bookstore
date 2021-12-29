import { Injectable } from '@nestjs/common';
import { ShoppingCart, ShoppingCartItems } from '@prisma/client';
import { BooksService } from 'src/books/books.service';
import { ShoppingCartItemsService } from 'src/cart-items/cart-items.service';
import { ShoppingCartItemsToolbelt } from 'src/cart-items/cart-items.toolbelt.service';
import { CreateCartItemsDto } from 'src/cart-items/dto/create-cart-items.dto';
import { ShoppingCartRepository } from './cart.repository';
import { AddItemDto } from './dto/add-item.dto';

@Injectable()
export class ShoppingCartToolbelt {
  constructor(
    private repository: ShoppingCartRepository,
    private cartItems: ShoppingCartItemsService,
    private toolbeltItems: ShoppingCartItemsToolbelt,
    private book: BooksService,
  ) {}

  async findUnique(id: number): Promise<ShoppingCart> {
    return await this.repository.findUniqueId(id);
  }

  async findUniqueUserCart(username: string): Promise<ShoppingCart> {
    return await this.repository.findUniqueUserCart(username);
  }

  async findManyCarts(): Promise<ShoppingCart[]> {
    return await this.repository.findManyCarts();
  }

  async createAnonCart(): Promise<ShoppingCart> {
    return await this.repository.createAnonCart();
  }

  async createUserCart(username: string): Promise<ShoppingCart> {
    return await this.repository.createUserCart(username);
  }

  async updateTotalCartPrice(shoppingCartId: number): Promise<ShoppingCart> {
    const totalCartPrice = await this.cartItems.calculateTotalPrice(
      shoppingCartId,
    );
    await this.repository.updateShoppingCartTotalPrice(
      shoppingCartId,
      totalCartPrice,
    );

    const updatedCart = await this.findUnique(shoppingCartId);

    return updatedCart;
  }

  async updateCartOwner(userCartId: number, anonymousCartId: number) {
    const cartItems = await this.toolbeltItems.findMany(anonymousCartId);
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
    const createdBook = await this.cartItems.createOrUpdateItem(
      createCartItemsDto,
    );

    return createdBook;
  }

  async updateCartItem(addItemDto: AddItemDto): Promise<ShoppingCartItems> {
    const updateCartItem: CreateCartItemsDto = {
      shoppingCartId: addItemDto.shoppingCartId,
      bookId: addItemDto.bookId,
      quantity: addItemDto.quantity,
    };
    const updatedBook = await this.cartItems.createOrUpdateItem(updateCartItem);

    return updatedBook;
  }
}
