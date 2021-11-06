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
    const user = this.db.user.findUnique({ where: { username: username } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
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

  async softDelete(username: string): Promise<User> {
    const user = await this.db.user.findUnique({
      where: { username: username },
    });

    user.email = 'user deleted';
    user.password = 'user deleted';
    user.profilePhoto = 'user deleted';
    user.phonenumber = 'user deleted';
    user.active = false;
    user.deleted = true;

    await this.db.user.update({
      where: { username: username },
      data: user,
    });

    return await this.db.user.findUnique({
      where: { username: username },
      include: {
        booksBought: true,
        shoppingCart: true,
        shoppingHistory: true,
      },
    });
  }

  async enable(username: string): Promise<User> {
    const user = await this.db.user.findUnique({
      where: { username: username },
    });
    if (user.deleted === false) {
      return await this.db.user.update({
        where: { username: username },
        data: { active: true },
      });
    } else {
      throw new NotFoundException();
    }
  }

  async disable(username: string): Promise<User> {
    const user = await this.db.user.findUnique({
      where: { username: username },
    });
    if (user.deleted === false) {
      return await this.db.user.update({
        where: { username: username },
        data: { active: false },
      });
    } else {
      throw new NotFoundException();
    }
  }
}
