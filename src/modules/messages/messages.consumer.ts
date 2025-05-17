import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Message } from './messages.entity';
import { MESSAGES_REPOSITORY } from 'src/config/constants';

@Controller()
export class MessagesConsumer {
  constructor(
    @Inject(MESSAGES_REPOSITORY) private messageRepository: typeof Message,
  ) {}

  @EventPattern({ cmd: 'message_created' })
  async handleMessage(@Payload() data: any) {
    console.log('Received message from queue:', data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await this.messageRepository.create(data);
  }
}
