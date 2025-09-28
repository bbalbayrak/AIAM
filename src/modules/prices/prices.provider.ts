import { PRICES_REPOSITORY } from 'src/config/constants';
import { Prices } from './prices.entity';

export const pricesProvider = [
  {
    provide: PRICES_REPOSITORY,
    useValue: Prices,
  },
];
