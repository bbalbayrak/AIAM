import { AGENCY_REPOSITORY, USER_REPOSITORY } from 'src/config/constants';
import { Agency } from './agency.entity';

export const AgencyProvider = [
  {
    provide: AGENCY_REPOSITORY,
    useValue: Agency,
  },
];
