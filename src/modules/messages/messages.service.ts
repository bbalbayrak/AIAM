import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MessageDto } from './dto/messages.dto';
import { MESSAGES_REPOSITORY } from 'src/config/constants';
import { Message } from './messages.entity';
import { UserService } from '../user/user.service';
import { Op } from 'sequelize';
import { Request } from 'express';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('MESSAGE_SERVICE') private client: ClientProxy,
    @Inject(MESSAGES_REPOSITORY)
    private readonly messageRepository: typeof Message,
    private readonly userService: UserService,
  ) {}

  async sendMessage(messageDto: MessageDto) {
    this.client.emit(
      { cmd: 'message_created' },
      {
        ...messageDto,
        options: {
          persistent: true,
        },
      },
    );
  }

  async getUserConversations(req: Request): Promise<any[]> {
    const userId = req.user['userId'];

    const messages = await this.messageRepository.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
      },
      order: [['sent_at', 'ASC']],
    });

    const grouped = new Map<number, Message[]>();

    for (const msg of messages) {
      if (!grouped.has(msg.contract_id)) {
        grouped.set(msg.contract_id, []);
      }
      grouped.get(msg.contract_id).push(msg);
    }

    const result = Array.from(grouped.entries()).map(
      ([contract_id, messages]) => {
        const firstMessage = messages[0];
        const otherUserId =
          firstMessage.sender_id === userId
            ? firstMessage.receiver_id
            : firstMessage.sender_id;

        return {
          contract_id,
          messages,
          other_user_id: otherUserId,
        };
      },
    );

    return result;
  }

  // Get all messages in a conversation
  async getMessagesByConversation(contractId: number): Promise<Message[]> {
    return this.messageRepository.findAll({
      where: { contract_id: contractId },
      order: [['sent_at', 'ASC']],
    });
  }

  // Mark message as read
  async markAsRead(id: number): Promise<Message> {
    const message = await this.messageRepository.findByPk(id);
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    message.read_at = new Date();
    await message.save();
    return message;
  }
}
