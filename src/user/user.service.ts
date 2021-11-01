import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}

  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    return await this.db.user.create({ data: createUserDto });
  }

  async findAll(): Promise<User[]> {
    return await this.db.user.findMany();
  }

  async findUnique(id: number): Promise<User> {
    return await this.db.user.findUnique({ where: { id } });
  }

  async update(
    id: number,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.db.user.update({ where: { id }, data: updateUserDto });
  }

  async remove(id: number): Promise<User> {
    return await this.db.user.delete({ where: { id } });
  }
}
