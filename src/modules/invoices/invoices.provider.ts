import { INVOICES_REPOSITORY } from 'src/config/constants';
import { Invoices } from './invoices.entity';

export const InvoicesProvider = [
  {
    provide: INVOICES_REPOSITORY,
    useValue: Invoices,
  },
];
