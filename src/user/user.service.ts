import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}
  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    const usernameExists = await this.db.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (usernameExists) {
      throw new ConflictException(
        `Username ${createUserDto.username} already exists`,
      );
    }
    const emailExists = await this.db.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (emailExists) {
      throw new ConflictException(
        `Email ${createUserDto.email} already exists`,
      );
    }
    const cpfExists = await this.db.user.findUnique({
      where: { cpf: createUserDto.cpf },
    });
    if (cpfExists) {
      throw new ConflictException(`CPF ${createUserDto.cpf} already exists`);
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.db.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.db.user.findMany();
  }

  async findUnique(id: number): Promise<User> {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return await this.db.user.findUnique({ where: { username } });
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
