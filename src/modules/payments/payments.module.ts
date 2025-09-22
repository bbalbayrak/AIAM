import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentProvider } from './payment.provider';

@Module({
  providers: [PaymentsService, ...PaymentProvider],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
