import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessageProvider } from './messages.provider';
import { MessagesConsumer } from './messages.consumer';
import { UserModule } from '../user/user.module';
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [
    UserModule,
    ClientsModule.register([
      {
        name: 'MESSAGE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'messages_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [
    MessagesService,
    ...MessageProvider,
    MessagesConsumer,
    MessagesGateway,
  ],
  controllers: [MessagesController, MessagesConsumer],
  exports: [...MessageProvider, MessagesService],
})
export class MessagesModule {}
