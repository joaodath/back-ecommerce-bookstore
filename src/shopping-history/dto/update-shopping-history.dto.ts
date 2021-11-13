import { PartialType } from '@nestjs/mapped-types';
import { CreateShoppingHistoryDto } from './create-shopping-history.dto';

export class UpdateShoppingHistoryDto extends PartialType(CreateShoppingHistoryDto) {}
