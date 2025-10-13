import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsProvider } from './subscriptions.provider';

@Module({
  providers: [SubscriptionsService, ...SubscriptionsProvider],
  controllers: [SubscriptionsController],
  exports: [...SubscriptionsProvider],
})
export class SubscriptionsModule {}
