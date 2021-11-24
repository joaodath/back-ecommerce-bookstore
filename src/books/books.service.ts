import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Books, Publisher, Authors, Category } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublisherService } from 'src/publisher/publisher.service';
import { AddBookPublisherDto } from 'src/publisher/dto/add-book-publisher.dto';
import { RemoveBookPublisherDto } from 'src/publisher/dto/remove-book-publisher.dto';
import { CategoryService } from 'src/category/category.service';
import { AddBookCategoryDto } from 'src/category/dto/add-book-category.dto';
import { AuthorService } from 'src/author/author.service';
import { AddBookAuthorDto } from 'src/author/dto/add-book-author.dto';
import { RemoveBookAuthorDto } from 'src/author/dto/remove-book-author.dto';
import { RemoveBookCategoryDto } from 'src/category/dto/remove-book-category.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    private db: PrismaService,
    private author: AuthorService,
    private category: CategoryService,
    private publisher: PublisherService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Books> {
    try {
      if (createBookDto.ebook) {
        if (createBookDto.hardCover === true) {
          throw new Error('Book can not be both e-book and hard cover');
        }
        if (createBookDto.weight) {
          throw new Error('eBook can not have weight');
        }
        if (
          createBookDto.length ||
          createBookDto.width ||
          createBookDto.height
        ) {
          throw new Error('eBook can not have dimensions');
        }
      }
      const {
        authorId,
        author,
        publisherId,
        publisher,
        categoryId,
        category,
        ...bookData
      } = createBookDto;
      const bookCreated = await this.db.books.create({ data: bookData });
      if (!bookCreated) {
        throw new Error('Book not created. Try again.');
      }

      if (createBookDto.authorId && createBookDto.author) {
        await this.db.books.update({
          where: { id: bookCreated.id },
          data: {
            author: {
              connectOrCreate: {
                where: { id: createBookDto.authorId },
                create: { name: createBookDto.author },
              },
            },
          },
        });
      }

      if (createBookDto.categoryId && createBookDto.category) {
        await this.db.books.update({
          where: { id: bookCreated.id },
          data: {
            category: {
              connectOrCreate: {
                where: { id: createBookDto.categoryId },
                create: { name: createBookDto.category },
              },
            },
          },
        });
      }

      if (createBookDto.publisherId && createBookDto.publisher) {
        await this.db.books.update({
          where: { id: bookCreated.id },
          data: {
            publisher: {
              connectOrCreate: {
                where: { id: createBookDto.publisherId },
                create: { name: createBookDto.publisher },
              },
            },
          },
        });
      }

      return await this.findUnique(bookCreated.id);
    } catch (err) {
      console.log(err);
      throw new Error('An error happened. Try again!');
    }
  }

  async findAll(): Promise<Books[]> {
    return await this.db.books.findMany({
      include: {
        author: true,
        publisher: true,
        category: true,
      },
    });
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

  async findByPublisher(publisher: string): Promise<Publisher[]> {
    return await this.db.publisher.findMany({
      where: { name: publisher },
      include: {
        books: {
          include: {
            category: true,
            author: true,
          },
        },
      },
    });
  }

  async findByAuthor(author: string): Promise<Authors[]> {
    return await this.db.authors.findMany({
      where: { name: author },
      include: {
        books: {
          include: {
            category: true,
            publisher: true,
          },
        },
      },
    });
  }

  async findByCategory(category: string): Promise<Category[]> {
    return await this.db.category.findMany({
      where: { name: category },
      include: {
        books: {
          include: {
            publisher: true,
            author: true,
          },
        },
      },
    });
  }

  async update(
    id: number,
    updateBookDto: Prisma.BooksUpdateInput,
  ): Promise<Books> {
    return await this.db.books.update({ where: { id }, data: updateBookDto });
  }

  async remove(id: number): Promise<Books> {
    try {
      const deleteOperation = await this.db.books.delete({ where: { id } });
      return deleteOperation;
    } catch (err) {
      throw new NotFoundException();
    }
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

  async removeCategory(removeCategory: RemoveBookCategoryDto): Promise<Books> {
    const book = await this.db.books.findUnique({
      where: { id: removeCategory.bookId },
    });
    if (book) {
      const category = await this.category.removeBook(removeCategory);
      if (category) {
        return await this.findUnique(removeCategory.bookId);
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new NotFoundException();
    }
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

  async removeAuthor(removeAuthor: RemoveBookAuthorDto): Promise<Books> {
    const book = await this.db.books.findUnique({
      where: { id: removeAuthor.bookId },
    });
    if (book) {
      const author = await this.author.removeBook(removeAuthor);
      if (author) {
        return await this.findUnique(removeAuthor.bookId);
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new NotFoundException();
    }
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
