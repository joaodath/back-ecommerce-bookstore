import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Books } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryService } from 'src/category/category.service';
import { AddBookCategoryDto } from 'src/category/dto/add-book-category.dto';

@Injectable()
export class BooksService {
  constructor(private db: PrismaService, private category: CategoryService) {}

  async create(createBookDto: Prisma.BooksCreateInput): Promise<Books> {
    return await this.db.books.create({ data: createBookDto });
  }

  async findAll(): Promise<Books[]> {
    return await this.db.books.findMany();
  }

  async findUnique(id: number): Promise<Books> {
    return await this.db.books.findUnique({
      where: { id: id },
      include: {
        author: true,
        publisher: true,
        category: true,
      },
    });
  }

  async findByTitle(title: string): Promise<Books[]> {
    return await this.db.books.findMany({ where: { title } });
  }

  async update(
    id: number,
    updateBookDto: Prisma.BooksUpdateInput,
  ): Promise<Books> {
    return await this.db.books.update({ where: { id }, data: updateBookDto });
  }

  async remove(id: number): Promise<Books> {
    return await this.db.books.delete({ where: { id } });
  }

  async addCategory(addCategory: AddBookCategoryDto): Promise<Books> {
    const book = await this.db.books.findUnique({
      where: { id: addCategory.bookId },
    });
    if (book) {
      const category = await this.category.addBook(addCategory);
      if (category) {
        return await this.findUnique(addCategory.bookId);
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new NotFoundException();
    }
  }
}
