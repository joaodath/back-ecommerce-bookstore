import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Prisma, Books, Publisher, Authors, Category } from '.prisma/client';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('new')
  @UsePipes(ValidationPipe)
  async create(@Body() createBookDto: Prisma.BooksCreateInput): Promise<Books> {
    return await this.booksService.create(createBookDto);
  }

  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<Books[]> {
    return await this.booksService.findAll();
  }

  @Get('/id/:id')
  @UsePipes(ValidationPipe)
  async findUnique(@Param('id', ParseIntPipe) id: number): Promise<Books> {
    return this.booksService.findUnique(id);
  }

  @Get('/title/:title')
  @UsePipes(ValidationPipe)
  async findTitle(@Param('title') title: string): Promise<Books[]> {
    return await this.booksService.findByTitle(title);
  }

  @Get('/publisher/:publisher')
  @UsePipes(ValidationPipe)
  async findPublisher(
    @Param('publisher') publisher: string,
  ): Promise<Publisher[]> {
    return await this.booksService.findByPublisher(publisher);
  }

  @Get('/author/:author')
  @UsePipes(ValidationPipe)
  async findAuthor(@Param('author') author: string): Promise<Authors[]> {
    return await this.booksService.findByAuthor(author);
  }

  @Get('/category/:category')
  @UsePipes(ValidationPipe)
  async findCategory(@Param('category') category: string): Promise<Category[]> {
    return await this.booksService.findByCategory(category);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: Prisma.BooksUpdateInput,
  ): Promise<Books> {
    return await this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Books> {
    return await this.booksService.remove(id);
  }
}
