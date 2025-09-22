import { PAYMENT_METHODS_REPOSITORY } from 'src/config/constants';
import { PaymentMethod } from './payment-methods.entity';

export const PaymentMethodsProvider = [
  {
    provide: PAYMENT_METHODS_REPOSITORY,
    useValue: PaymentMethod,
  },
];
