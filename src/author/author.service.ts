import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Authors } from '.prisma/client';
import { AddBookAuthorDto } from './dto/add-book-author.dto';
import { RemoveBookAuthorDto } from './dto/remove-book-author.dto';

@Injectable()
export class AuthorService {
  constructor(private db: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Authors> {
    return await this.db.authors.create({ data: createAuthorDto });
  }

  async findAll(): Promise<Authors[]> {
    const allAuthors = await this.db.authors.findMany();
    if (allAuthors) {
      return allAuthors;
    } else {
      throw new NotFoundException();
    }
  }

  async findUnique(id: number): Promise<Authors> {
    const author = await this.db.authors.findUnique({ where: { id } });
    if (author) {
      return author;
    } else {
      throw new NotFoundException();
    }
  }

  async findByName(name: string): Promise<Authors[]> {
    const author = await this.db.authors.findMany({ where: { name } });
    if (author) {
      return author;
    } else {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Authors> {
    const author = await this.db.authors.findUnique({ where: { id } });
    if (author) {
      return await this.db.authors.update({
        where: { id },
        data: updateAuthorDto,
      });
    } else {
      throw new NotFoundException();
    }
  }

  async remove(id: number): Promise<Authors> {
    const author = await this.db.authors.findUnique({ where: { id } });
    if (author) {
      return await this.db.authors.delete({ where: { id } });
    } else {
      throw new NotFoundException();
    }
  }

  async addBook(addBook: AddBookAuthorDto): Promise<boolean> {
    const author = await this.db.authors.findUnique({
      where: { id: addBook.authorId },
    });
    if (author) {
      await this.db.books.update({
        where: { id: addBook.bookId },
        data: {
          author: {
            connect: {
              id: addBook.authorId,
            },
          },
        },
      });
      return true;
    } else {
      return false;
    }
  }

  async removeBook(removeBook: RemoveBookAuthorDto): Promise<boolean> {
    const author = await this.db.authors.findUnique({
      where: { id: removeBook.authorId },
    });
    if (author) {
      await this.db.books.update({
        where: { id: removeBook.bookId },
        data: {
          author: {
            disconnect: {
              id: removeBook.authorId,
            },
          },
        },
      });
      return true;
    } else {
      return false;
    }
  }
}
