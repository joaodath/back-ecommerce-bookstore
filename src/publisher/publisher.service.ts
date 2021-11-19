import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from '.prisma/client';
import { AddBookPublisherDto } from 'src/publisher/dto/add-book-publisher.dto';
import { RemoveBookPublisherDto } from 'src/publisher/dto/remove-book-publisher.dto';

@Injectable()
export class PublisherService {
  constructor(private db: PrismaService) {}

  async create(createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    return await this.db.publisher.create({ data: createPublisherDto });
  }

  async findAll(): Promise<Publisher[]> {
    const allPublishers = await this.db.publisher.findMany();
    if (allPublishers) {
      return allPublishers;
    } else {
      throw new NotFoundException();
    }
  }

  async findUnique(id: number): Promise<Publisher> {
    const publisher = await this.db.publisher.findUnique({ where: { id } });
    if (publisher) {
      return publisher;
    } else {
      throw new NotFoundException();
    }
  }

  async findByName(name: string): Promise<Publisher[]> {
    const publisher = await this.db.publisher.findMany({ where: { name } });
    if (publisher) {
      return publisher;
    } else {
      throw new NotFoundException();
    }
  }

  async update(
    id: number,
    updatePublisherDto: UpdatePublisherDto,
  ): Promise<Publisher> {
    const publisher = await this.db.publisher.findUnique({ where: { id } });
    if (publisher) {
      return await this.db.publisher.update({
        where: { id },
        data: updatePublisherDto,
      });
    } else {
      throw new NotFoundException();
    }
  }

  async remove(id: number): Promise<Publisher> {
    const publisher = await this.db.publisher.findUnique({ where: { id } });
    if (publisher) {
      return await this.db.publisher.delete({ where: { id } });
    } else {
      throw new NotFoundException();
    }
  }

  async addBook(addBook: AddBookPublisherDto): Promise<boolean> {
    const publisher = await this.db.publisher.findUnique({
      where: { id: addBook.publisherId },
    });
    if (publisher) {
      await this.db.books.update({
        where: { id: addBook.bookId },
        data: {
          publisher: {
            connect: {
              id: addBook.publisherId,
            },
          },
        },
      });
      return true;
    } else {
      return false;
    }
  }

  async removeBook(removeBook: RemoveBookPublisherDto): Promise<boolean> {
    const publisher = await this.db.publisher.findUnique({
      where: { id: removeBook.publisherId },
    });
    if (publisher) {
      await this.db.books.update({
        where: { id: removeBook.bookId },
        data: {
          publisher: {
            disconnect: {
              id: removeBook.publisherId,
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
