import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User, UserAddresses } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { userWithoutPasswordDto } from './dto/user-without-password.dto';
import { AddAddressDto } from './dto/add-address.dto';
import { Address } from 'src/addresses/entities/address.entity';
import { threadId } from 'worker_threads';
import { AddItemDto } from 'src/cart/dto/add-item.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressesService } from 'src/addresses/addresses.service';
import { RemoveAddressDto } from './dto/remove-address.dto';
@Injectable()
export class UserService {
  constructor(private db: PrismaService, private userAddresses: AddressesService) {}
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

  async addAddress(
    username: string,
    addAddressDto: AddAddressDto,
  ): Promise<User> {
    const user = await this.db.user.findUnique({
      where: { username: username },
    });
    const userId = user.username;
    const address = await this.db.userAddresses.create({
      data: addAddressDto,
    });
    await this.db.userAddresses.update({
      where: { username: userId },
      data: {
        ...addAddressDto,
        user: {
          connect: address,
        },
      },
    });
    return await this.db.user.findUnique({
      where: { username: username },
      include: { userAddresses: true },
    });
  }

  async updateAddress(
    username: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<User> {
    const user = await this.db.user.findUnique({
      where: { username: username },
    });
    const address = await this.db.userAddresses.findUnique([
      where: { id: id },
    ]);
    const updateAddress = await this.db.userAddresses.update({
      where: { id: address.id },
      data: {
        ...updateAddressDto,
        user: {
          connect: address,
        },
      },
    });
    return await this.db.user.findUnique({
      where: { username: username },
      include: { userAddresses: true },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.db.user.findMany();
  }

  // async findUnique(id: number): Promise<User> {
  //   const user = await this.db.user.findUnique({ where: { id } });
  //   if (!user) {
  //     throw new NotFoundException();
  //   }
  //   return user;
  // }

  async findByUsername(username: string): Promise<userWithoutPasswordDto> {
    const user = await this.db.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      throw new NotFoundException();
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByUsernameJWT(username: string): Promise<User> {
    const user = this.db.user.findUnique({ where: { username: username } });
    return user;
  }

  async update(
    username: string,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.db.user.update({
      where: { username: username },
      data: updateUserDto,
    });
  }

  async remove(username: string): Promise<User> {
    return await this.db.user.delete({ where: { username: username } });
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
