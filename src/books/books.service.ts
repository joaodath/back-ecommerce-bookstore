import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Books } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublisherService } from 'src/publisher/publisher.service';
import { AddBookPublisherDto } from 'src/publisher/dto/add-book-publisher.dto';
import { RemoveBookPublisherDto } from 'src/publisher/dto/remove-book-publisher.dto';

@Injectable()
export class BooksService {
  constructor(private db: PrismaService, private publisher: PublisherService) {}

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

  async addPublisher(addPublisher: AddBookPublisherDto): Promise<Books> {
    const book = await this.db.books.findUnique({
      where: { id: addPublisher.bookId },
    });
    if (book) {
      const publisher = await this.publisher.addBook(addPublisher);
      if (publisher) {
        return await this.findUnique(addPublisher.bookId);
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  async removePublisher(
    removePublisher: RemoveBookPublisherDto,
  ): Promise<Books> {
    const book = await this.db.books.findUnique({
      where: { id: removePublisher.bookId },
    });
    if (book) {
      const publisher = await this.publisher.removeBook(removePublisher);
      if (publisher) {
        return await this.findUnique(removePublisher.bookId);
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new NotFoundException();
    }
  }
}
