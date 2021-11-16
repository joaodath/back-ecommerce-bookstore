import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, Books } from '.prisma/client';
import { AddBookCategoryDto } from './dto/add-book-category.dto';
import { RemoveBookCategoryDto } from './dto/remove-book-category.dto';

@Injectable()
export class CategoryService {
  constructor(private db: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.db.category.create({ data: createCategoryDto });
  }

  async findAll(): Promise<Category[]> {
    const allCategories = await this.db.category.findMany();
    if (allCategories) {
      return allCategories;
    } else {
      throw new NotFoundException();
    }
  }

  async findUnique(id: number): Promise<Category> {
    const category = await this.db.category.findUnique({ where: { id } });
    if (category) {
      return category;
    } else {
      throw new NotFoundException();
    }
  }

  async findByName(name: string): Promise<Category[]> {
    const category = await this.db.category.findMany({ where: { name } });
    if (category) {
      return category;
    } else {
      throw new NotFoundException();
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.db.category.findUnique({ where: { id } });
    if (category) {
      return await this.db.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } else {
      throw new NotFoundException();
    }
  }

  async remove(id: number): Promise<Category> {
    const category = await this.db.category.findUnique({ where: { id } });
    if (category) {
      return await this.db.category.delete({ where: { id } });
    } else {
      throw new NotFoundException();
    }
  }

  async addBook(addBook: AddBookCategoryDto): Promise<boolean> {
    const category = await this.db.category.findUnique({
      where: { id: addBook.categoryId },
    });
    if (category) {
      await this.db.books.update({
        where: { id: addBook.bookId },
        data: {
          category: {
            connect: {
              id: addBook.categoryId,
            },
          },
        },
      });
      return true;
    } else {
      return false;
    }
  }

  async removeBook(removeBook: RemoveBookCategoryDto): Promise<Books> {
      where: { id: removeBook.bookId },
      data: {
        category: {
          disconnect: {
            id: removeBook.categoryId,
          },
        },
      },
    });
    return await this.db.books.findUnique({
      where: { id: removeBook.bookId },
      include: {
        author: true,
        publisher: true,
        category: true,
      },
    });
  }
}
