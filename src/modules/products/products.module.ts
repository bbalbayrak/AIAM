import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsProvider } from './products.provider';

@Module({
  providers: [ProductsService, ...ProductsProvider],
  controllers: [ProductsController],
  exports: [...ProductsProvider],
})
export class ProductsModule {}
