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
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '.prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { userWithoutPasswordDto } from './dto/user-without-password.dto';

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

  // @Get('/id/:id')
  // @UsePipes(ValidationPipe)
  // async findUnique(@Param('id', ParseIntPipe) id: number): Promise<User> {
  //   return await this.userService.findUnique(id);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async findByUsername(@Request() req): Promise<userWithoutPasswordDto> {
    return await this.userService.findByUsername(req.user.username);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Request() req,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.userService.update(req.user.username, updateUserDto);
  }

  @Patch('disable')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async disable(@Request() req): Promise<User> {
    return await this.userService.disable(req.user.username);
  }

  @Patch('softdelete')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async softDelete(@Request() req): Promise<User> {
    return await this.userService.softDelete(req.user.username);
  }

  @Delete('del/:username')
  @UsePipes(ValidationPipe)
  async remove(@Param('username') username: string): Promise<User> {
    return await this.userService.remove(username);
  }
}
