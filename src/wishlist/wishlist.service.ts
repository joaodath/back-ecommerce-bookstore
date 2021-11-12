import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, WishList } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private db: PrismaService) {}
  async create(
    username: string,
    createWishlistDto: Prisma.WishListCreateInput,
  ): Promise<WishList> {
    const user = await this.db.user.findUnique({
      where: { username: username },
    });
    if (!user.active || !user.deleted) {
      throw new NotFoundException();
    }

    const wishlist = await this.db.wishList.create({
      data: createWishlistDto,
    });

    await this.db.wishList.update({
      where: { id: wishlist.id },
      data: {
        user: {
          connect: {
            username: username,
          },
        },
      },
    });

    const wishlistReturn = await this.db.wishList.findUnique({
      where: {
        id: wishlist.id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        books: true,
      },
    });

    return wishlistReturn;
  }

  async findAll(): Promise<WishList[]> {
    return await this.db.wishList.findMany({});
  }

  async findUnique(id: number): Promise<WishList> {
    const wishlist = await this.db.wishList.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        books: true,
      },
    });

    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: Prisma.WishListUpdateInput,
  ): Promise<WishList> {
    const updateWishlist = await this.db.wishList.update({
      where: { id: id },
      data: updateWishlistDto,
    });
    return updateWishlist;
  }

  async addBook(
    userId: number,
    wishListId: number,
    bookId: number,
  ): Promise<WishList> {
    await this.db.wishList.findUnique({
      where: { userId: userId },
    });
    await this.db.wishList.update({
      where: { id: wishListId },
      data: {
        books: {
          connect: {
            id: bookId,
          },
        },
      },
    });
    return await this.findUnique(wishListId);
  }

  async remove(id: number): Promise<WishList> {
    return await this.db.wishList.delete({ where: { id: id } });
  }
}
