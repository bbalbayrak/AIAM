import { SUBSCRIPTIONS_REPOSITORY } from 'src/config/constants';
import { Subscriptions } from './subscriptions.entity';

export const SubscriptionsProvider = [
  {
    provide: SUBSCRIPTIONS_REPOSITORY,
    useValue: Subscriptions,
  },
];
