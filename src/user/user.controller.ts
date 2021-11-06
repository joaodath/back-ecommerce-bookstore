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
import { UserService } from './user.service';
import { Prisma, User } from '.prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  @UsePipes(ValidationPipe)
  async create(@Body() createUserDto: Prisma.UserCreateInput): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/id/:id')
  @UsePipes(ValidationPipe)
  async findUnique(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findUnique(id);
  }

  @Get(':username')
  @UsePipes(ValidationPipe)
  async findByUsername(@Param('username') username: string): Promise<User> {
    return await this.userService.findByUsername(username);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Patch('disable/:username')
  @UsePipes(ValidationPipe)
  async disable(@Param('username') username: string): Promise<User> {
    return await this.userService.disable(username);
  }

  @Patch('/softdelete/:username')
  @UsePipes(ValidationPipe)
  async softDelete(@Param('username') username: string): Promise<User> {
    return await this.userService.softDelete(username);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.remove(id);
  }
}
