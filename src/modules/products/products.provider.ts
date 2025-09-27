import { PRODUCTS_REPOSITORY } from 'src/config/constants';
import { Products } from './products.entity';

export const ProductsProvider = [
  {
    provide: PRODUCTS_REPOSITORY,
    useValue: Products,
  },
];
