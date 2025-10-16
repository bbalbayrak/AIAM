import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsProvider } from './payment-methods.provider';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [PaymentMethodsService, ...PaymentMethodsProvider],
  controllers: [PaymentMethodsController],
})
export class PaymentMethodsModule {}
