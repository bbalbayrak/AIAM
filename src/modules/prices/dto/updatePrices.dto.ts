import { PartialType } from '@nestjs/mapped-types';
import { CreatePriceDto } from './prices.dto';

export class updatePriceDto extends PartialType(CreatePriceDto) {}
