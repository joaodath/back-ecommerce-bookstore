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
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '.prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { userWithoutPasswordDto } from './dto/user-without-password.dto';
import { ApiHeader, ApiBody } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@ApiBody({ type: [Prisma.UserCreateInput]})
  @Post('new')
  @UsePipes(ValidationPipe)
  async create(
    @Request() req,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    if (req.headers.authorization) {
      throw new ConflictException();
    } else {
      return await this.userService.create(createUserDto);
    }
  }

  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Token',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async findByUsername(@Request() req): Promise<userWithoutPasswordDto> {
    return await this.userService.findByUsername(req.user.username);
  }

  @Get('username/:username')
  // @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async findByUsernameAdm(
    @Param('username') username: string,
  ): Promise<userWithoutPasswordDto> {
    return await this.userService.findByUsername(username);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Token',
  })
  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Request() req,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.userService.update(req.user.username, updateUserDto);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Token',
  })
  @Patch('disable')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async disable(@Request() req): Promise<User> {
    return await this.userService.disable(req.user.username);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Token',
  })
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
