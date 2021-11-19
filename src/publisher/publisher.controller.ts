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

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Post('new')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createPublisherDto: CreatePublisherDto,
  ): Promise<Publisher> {
    return await this.publisherService.create(createPublisherDto);
  }

  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<Publisher[]> {
    return this.publisherService.findAll();
  }

  @Get('/id/:id')
  @UsePipes(ValidationPipe)
  async findUnique(@Param('id', ParseIntPipe) id: number): Promise<Publisher> {
    return this.publisherService.findUnique(id);
  }

  @Get('/name/:name')
  @UsePipes(ValidationPipe)
  async findName(@Param('name') name: string): Promise<Publisher[]> {
    return await this.publisherService.findByName(name);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ): Promise<Publisher> {
    return this.publisherService.update(id, updatePublisherDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.publisherService.remove(id);
  }
}
