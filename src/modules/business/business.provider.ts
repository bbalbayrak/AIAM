import { BUSINESS_REPOSITORY } from 'src/config/constants';
import { Business } from './business.entity';

export const BusinessProvider = [
  {
    provide: BUSINESS_REPOSITORY,
    useValue: Business,
  },
];
