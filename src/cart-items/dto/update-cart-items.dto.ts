import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemsDto } from './create-cart-items.dto';

export class UpdateCartItemsDto extends PartialType(CreateCartItemsDto) {}
