import { Injectable } from '@nestjs/common';
import { Prisma, CouponCodes } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CouponCodesService {
  constructor(private db: PrismaService) {}

  async create(
    createCouponCodeDto: Prisma.CouponCodesCreateInput,
  ): Promise<CouponCodes> {
    return await this.db.couponCodes.create({ data: createCouponCodeDto });
  }

  async findAll(): Promise<CouponCodes[]> {
    return await this.db.couponCodes.findMany();
  }

  async findUnique(code: string): Promise<CouponCodes> {
    return await this.db.couponCodes.findUnique({ where: { code } });
  }

  async update(
    code: string,
    updateCouponCodeDto: Prisma.BooksUpdateInput,
  ): Promise<CouponCodes> {
    return await this.db.couponCodes.update({
      where: { code },
      data: updateCouponCodeDto,
    });
  }

  async remove(code: string): Promise<CouponCodes> {
    return await this.db.couponCodes.delete({ where: { code } });
  }
}
