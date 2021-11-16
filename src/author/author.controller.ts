import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards.
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { Authors } from '.prisma/client';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post('new')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() createAuthorDto: CreateAuthorDto): Promise<Authors> {
    return await this.authorService.create(createAuthorDto);
  }

  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<Authors[]> {
    return await this.authorService.findAll();
  }

  @Get('/id/:id')
  @UsePipes(ValidationPipe)
  async findUnique(@Param('id', ParseIntPipe) id: number): Promise<Authors> {
    return await this.authorService.findUnique(id);
  }

  @Get('/name/:name')
  @UsePipes(ValidationPipe)
  async findName(@Param('name') name: string): Promise<Authors[]> {
    return await this.authorService.findByName(name);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Authors> {
    return await this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Authors> {
    return await this.authorService.remove(id);
  }
}
