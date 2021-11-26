import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { Authors } from '.prisma/client';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Author')
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @Post('new')
  //@UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() createAuthorDto: CreateAuthorDto): Promise<Authors> {
    return await this.authorService.create(createAuthorDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<Authors[]> {
    return await this.authorService.findAll();
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('/id/:id')
  @UsePipes(ValidationPipe)
  async findUnique(@Param('id', ParseIntPipe) id: number): Promise<Authors> {
    return await this.authorService.findUnique(id);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('/name/:name')
  @UsePipes(ValidationPipe)
  async findName(@Param('name') name: string): Promise<Authors[]> {
    return await this.authorService.findByName(name);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Patch('/update/:id')
  //@UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Authors> {
    return await this.authorService.update(id, updateAuthorDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Delete('delete/:id')
  //@UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Authors> {
    return await this.authorService.remove(id);
  }
}
