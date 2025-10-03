import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoicesProvider } from './invoices.provider';

@Module({
  providers: [InvoicesService, ...InvoicesProvider],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
