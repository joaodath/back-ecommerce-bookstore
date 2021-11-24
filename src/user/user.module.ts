import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AddressesService } from 'src/addresses/addresses.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, AddressesService],
  exports: [UserService],
})
export class UserModule {}
