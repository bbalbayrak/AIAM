import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { InvoicesModule } from '../invoices/invoices.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [InvoicesModule, SubscriptionsModule],
  providers: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
