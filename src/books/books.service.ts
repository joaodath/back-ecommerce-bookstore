import { Injectable } from '@nestjs/common';
import { Prisma, Books } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private db: PrismaService) {}

  async create(createBookDto: Prisma.BooksCreateInput): Promise<Books> {
    return await this.db.books.create({ data: createBookDto });
  }

  async findAll(): Promise<Books[]> {
    return await this.db.books.findMany();
  }

  async findUnique(id: number): Promise<Books> {
    return await this.db.books.findUnique({ where: { id } });
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
}
