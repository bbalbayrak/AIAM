import { PAYMENT_REPOSITORY } from 'src/config/constants';
import { Payment } from './payments.entity';

export const PaymentProvider = [
  {
    provide: PAYMENT_REPOSITORY,
    useValue: Payment,
  },
];
