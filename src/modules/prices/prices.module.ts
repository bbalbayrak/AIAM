import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { pricesProvider } from './prices.provider';

@Module({
  providers: [PricesService, ...pricesProvider],
  controllers: [PricesController],
})
export class PricesModule {}
