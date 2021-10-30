import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, PrismaClient, User } from '.prisma/client';

@Injectable()
export class UserService {
  constructor(private db: PrismaClient) {}
  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    return await this.db.user.create({ data: createUserDto });
  }

  async findAll(): Promise<User[]> {
    return await this.db.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
