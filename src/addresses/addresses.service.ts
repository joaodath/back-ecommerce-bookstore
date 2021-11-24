import { Injectable } from '@nestjs/common';
import { UserAddresses } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private db: PrismaService) {}

  async createAddress(
    createAddressDto: CreateAddressDto,
  ): Promise<UserAddresses> {
    return await this.db.userAddresses.create({ data: createAddressDto });
  }

  async findAllAddresses(): Promise<UserAddresses[]> {
    return await this.db.userAddresses.findMany();
  }

  async updateAddress(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<UserAddresses> {
    return await this.db.userAddresses.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  async removeAddress(id: number): Promise<UserAddresses> {
    return await this.db.userAddresses.delete({ where: { id } });
  }
}
