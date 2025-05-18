import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  async sendMessageToUser(userId: number, message: any) {
    this.server.to(`user_${userId}`).emit('new_message', message);
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() payload: { userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`user_${payload.userId}`);
    console.log(`Client joined room: user_${payload.userId}`);
    return { event: 'joined', data: `user_${payload.userId}` };
  }
}
