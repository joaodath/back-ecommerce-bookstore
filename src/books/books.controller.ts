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
import { AddBookCategoryDto } from 'src/category/dto/add-book-category.dto';
import { RemoveBookCategoryDto } from 'src/category/dto/remove-book-category.dto';
import { AddBookAuthorDto } from 'src/author/dto/add-book-author.dto';
import { RemoveBookAuthorDto } from 'src/author/dto/remove-book-author.dto';
import { AddBookPublisherDto } from 'src/publisher/dto/add-book-publisher.dto';
import { RemoveBookPublisherDto } from 'src/publisher/dto/remove-book-publisher.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiResponse({
    status: 409,
    description: 'Conflito de dados. Revise dados enviados.',
  })
  @ApiResponse({ status: 500, description: 'Erro interno.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @Post('new')
  @UsePipes(ValidationPipe)
  async create(@Body() createBookDto: CreateBookDto): Promise<Books> {
    return await this.booksService.create(createBookDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<Books[]> {
    return await this.booksService.findAll();
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @ApiResponse({ status: 500, description: 'Erro interno.' })
  @Get('/id/:id')
  @UsePipes(ValidationPipe)
  async findUnique(@Param('id', ParseIntPipe) id: number): Promise<Books> {
    return this.booksService.findUnique(id);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('/title/:title')
  @UsePipes(ValidationPipe)
  async findTitle(@Param('title') title: string): Promise<Books[]> {
    return await this.booksService.findByTitle(title);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: Prisma.BooksUpdateInput,
  ): Promise<Books> {
    return await this.booksService.update(id, updateBookDto);
  }

  //Rotas de Categoria
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('/category/:category')
  @UsePipes(ValidationPipe)
  async findCategory(@Param('category') category: string): Promise<Category[]> {
    return await this.booksService.findByCategory(category);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @Post('add/category')
  @UsePipes(ValidationPipe)
  async addCategory(
    @Body() addCategoryDto: AddBookCategoryDto,
  ): Promise<Books> {
    return await this.booksService.addCategory(addCategoryDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @Post('remove/category')
  async removeCategory(
    @Body() removeCategoryDto: RemoveBookCategoryDto,
  ): Promise<Books> {
    return await this.booksService.removeCategory(removeCategoryDto);
  }

  //Rotas de Author
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('/author/:author')
  @UsePipes(ValidationPipe)
  async findAuthor(@Param('author') author: string): Promise<Authors[]> {
    return await this.booksService.findByAuthor(author);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @Post('add/author')
  @UsePipes(ValidationPipe)
  async addAuthor(@Body() addAuthorDto: AddBookAuthorDto): Promise<Books> {
    return await this.booksService.addAuthor(addAuthorDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @Post('remove/author')
  @UsePipes(ValidationPipe)
  async removeAuthor(
    @Body() removeAuthorDto: RemoveBookAuthorDto,
  ): Promise<Books> {
    return await this.booksService.removeAuthor(removeAuthorDto);
  }

  //Rotas de Publisher
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('/publisher/:publisher')
  @UsePipes(ValidationPipe)
  async findPublisher(
    @Param('publisher') publisher: string,
  ): Promise<Publisher[]> {
    return await this.booksService.findByPublisher(publisher);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @Post('add/publisher')
  @UsePipes(ValidationPipe)
  async addPublisher(
    @Body() addPublisherDto: AddBookPublisherDto,
  ): Promise<Books> {
    return await this.booksService.addPublisher(addPublisherDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @Post('remove/publisher')
  @UsePipes(ValidationPipe)
  async removePublisher(
    @Body() removePublisherDto: RemoveBookPublisherDto,
  ): Promise<Books> {
    return await this.booksService.removePublisher(removePublisherDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Books> {
    return await this.booksService.remove(id);
  }
}
