import { MESSAGES_REPOSITORY } from 'src/config/constants';
import { Message } from './messages.entity';

export const MessageProvider = [
  {
    provide: MESSAGES_REPOSITORY,
    useValue: Message,
  },
];
