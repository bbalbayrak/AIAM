import { CONTRACT_REPOSITORY } from 'src/config/constants';
import { Contract } from './contract.entity';

export const ContractProvider = [
  {
    provide: CONTRACT_REPOSITORY,
    useValue: Contract,
  },
];
