import { Injectable } from '@nestjs/common';
import { CreateShoppingHistoryDto } from './dto/create-shopping-history.dto';
import { UpdateShoppingHistoryDto } from './dto/update-shopping-history.dto';

@Injectable()
export class ShoppingHistoryService {
  create(createShoppingHistoryDto: CreateShoppingHistoryDto) {
    return 'This action adds a new shoppingHistory';
  }

  findAll() {
    return `This action returns all shoppingHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoppingHistory`;
  }

  update(id: number, updateShoppingHistoryDto: UpdateShoppingHistoryDto) {
    return `This action updates a #${id} shoppingHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingHistory`;
  }
}
