import { USER_REPOSITORY } from 'src/config/constants';
import { User } from './user.entity';

export const UsersProvider = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
