import { Module } from '@nestjs/common';
import { CouponCodesService } from './coupon-codes.service';
import { CouponCodesController } from './coupon-codes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [CouponCodesController],
  providers: [CouponCodesService, PrismaService],
})
export class CouponCodesModule {}
