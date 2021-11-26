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
import { PublisherService } from './publisher.service';
import { Publisher } from '.prisma/client';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Publisher')
@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @Post('new')
  //@UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createPublisherDto: CreatePublisherDto,
  ): Promise<Publisher> {
    return await this.publisherService.create(createPublisherDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<Publisher[]> {
    return this.publisherService.findAll();
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @Get('id/:id')
  @UsePipes(ValidationPipe)
  async findUnique(@Param('id', ParseIntPipe) id: number): Promise<Publisher> {
    return this.publisherService.findUnique(id);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @Get('name/:name')
  @UsePipes(ValidationPipe)
  async findName(@Param('name') name: string): Promise<Publisher[]> {
    return await this.publisherService.findByName(name);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @Patch('update/:id')
  //@UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ): Promise<Publisher> {
    return this.publisherService.update(id, updatePublisherDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @Delete('delete/:id')
  //@UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.publisherService.remove(id);
  }
}
