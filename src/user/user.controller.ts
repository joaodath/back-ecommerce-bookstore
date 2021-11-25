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
import { Prisma, User, UserAddresses } from '.prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { userWithoutPasswordDto } from './dto/user-without-password.dto';
import { AddAddressDto } from './dto/add-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { RemoveAddressDto } from './dto/remove-address.dto';

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

  @Post('address/add')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async addAddress(
    @Request() req,
    @Body() addAddressDto: AddAddressDto,
  ): Promise<User> {
    return await this.userService.addAddress(req.user.username, addAddressDto);
  }

  @Patch('address/update')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async updateAddress(
    @Request() req,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<User> {
    return await this.userService.updateAddress(
      req.user.username,
      updateAddressDto,
    );
  }

  @Delete('address/delete')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async removeAddress(
    @Request() req,
    @Body() removeAddressDto: RemoveAddressDto,
  ): Promise<UserAddresses> {
    return await this.userService.removeAddress(
      req.user.username,
      removeAddressDto,
    );
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
