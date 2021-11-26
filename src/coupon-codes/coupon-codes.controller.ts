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
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Coupon-Codes')
@Controller('coupon-codes')
export class CouponCodesController {
  constructor(private readonly couponCodesService: CouponCodesService) {}

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @Post('new')
  @UsePipes(ValidationPipe)
  async create(
    @Body() createCouponCodeDto: Prisma.CouponCodesCreateInput,
  ): Promise<CouponCodes> {
    return await this.couponCodesService.create(createCouponCodeDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('all')
  @UsePipes(ValidationPipe)
  async findAll(): Promise<CouponCodes[]> {
    return await this.couponCodesService.findAll();
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Get('/code/:code')
  @UsePipes(ValidationPipe)
  async findUnique(@Param('code') code: string): Promise<CouponCodes> {
    return this.couponCodesService.findUnique(code);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Patch(':code')
  @UsePipes(ValidationPipe)
  async update(
    @Param('code') code: string,
    @Body() updateCouponCodeDto: Prisma.CouponCodesUpdateInput,
  ): Promise<CouponCodes> {
    return this.couponCodesService.update(code, updateCouponCodeDto);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiResponse({ status: 200, description: 'Tudo certo' })
  @Delete(':code')
  @UsePipes(ValidationPipe)
  async remove(@Param('code') code: string): Promise<CouponCodes> {
    return await this.couponCodesService.remove(code);
  }
}
