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
} from '@nestjs/common';
import { CouponCodesService } from './coupon-codes.service';
import { Prisma, CouponCodes } from '.prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Coupon-Codes')
@Controller('coupon-codes')
export class CouponCodesController {
  constructor(private readonly couponCodesService: CouponCodesService) {}

  @Post('new')
  @UsePipes(ValidationPipe)
  async create(
    @Body() createCouponCodeDto: Prisma.CouponCodesCreateInput,
  ): Promise<CouponCodes> {
    return await this.couponCodesService.create(createCouponCodeDto);
  }

  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<CouponCodes[]> {
    return await this.couponCodesService.findAll();
  }

  @Get('/code/:code')
  @UsePipes(ValidationPipe)
  async findUnique(@Param('code') code: string): Promise<CouponCodes> {
    return this.couponCodesService.findUnique(code);
  }

  @Patch(':code')
  @UsePipes(ValidationPipe)
  async update(
    @Param('code') code: string,
    @Body() updateCouponCodeDto: Prisma.CouponCodesUpdateInput,
  ): Promise<CouponCodes> {
    return this.couponCodesService.update(code, updateCouponCodeDto);
  }

  @Delete(':code')
  @UsePipes(ValidationPipe)
  async remove(@Param('code') code: string): Promise<CouponCodes> {
    return await this.couponCodesService.remove(code);
  }
}
