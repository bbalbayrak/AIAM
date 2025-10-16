import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { pricesProvider } from './prices.provider';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  providers: [PricesService, ...pricesProvider],
  controllers: [PricesController],
})
export class PricesModule {}
