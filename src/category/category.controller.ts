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
import { CategoryService } from './category.service';
import { Category } from '.prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('new')
  @UsePipes(ValidationPipe)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Get('/id/:id')
  @UsePipes(ValidationPipe)
  async findUnique(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return await this.categoryService.findUnique(id);
  }

  @Get('/name/:name')
  @UsePipes(ValidationPipe)
  async findName(@Param('name') name: string): Promise<Category[]> {
    return await this.categoryService.findByName(name);
  }

  @Patch('/update/:id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return await this.categoryService.remove(id);
  }
}
