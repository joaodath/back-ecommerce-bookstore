import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Books } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthorService } from 'src/author/author.service';
import { AddBookAuthorDto } from 'src/author/dto/add-book-author.dto';
import { RemoveBookAuthorDto } from 'src/author/dto/remove-book-author.dto';

@Injectable()
export class BooksService {
  constructor(private db: PrismaService, private author: AuthorService) {}

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

  async addAuthor(addAuthor: AddBookAuthorDto): Promise<Books> {
    const book = await this.db.books.findUnique({
      where: { id: addAuthor.bookId },
    });
    if (book) {
      const author = await this.author.addBook(addAuthor);
      if (author) {
        return await this.findUnique(addAuthor.bookId);
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new NotFoundException();
    }
  }
}
