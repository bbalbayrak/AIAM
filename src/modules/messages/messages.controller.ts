import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageDto } from './dto/messages.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { MessagesGateway } from './messages.gateway';
import { UserService } from '../user/user.service';
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messageGateway: MessagesGateway,
    private readonly userService: UserService,
  ) {}

  @Post()
  async sendMessage(@Body() messageDto: MessageDto, @Res() res: Response) {
    const reciever = await this.userService.getUserById(messageDto.receiver_id);

    if (!reciever) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Receiver not found',
      });
    }

    const message = await this.messagesService.sendMessage(messageDto);

    await this.messageGateway.sendMessageToUser(
      messageDto.receiver_id,
      message,
    );
    return res.status(HttpStatus.CREATED).json({
      message: 'Message sent successfully',
      data: message,
    });
  }

  @Get('')
  async getUserConversations(@Req() req: Request, @Res() res: Response) {
    const conversations = await this.messagesService.getUserConversations(req);
    if (!conversations || conversations.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'No conversations found',
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Conversations retrieved successfully',
      data: conversations,
    });
  }

  @Get(':contract_id')
  async getMessagesByConversation(
    @Param('contract_id', ParseIntPipe) contract_id: number,
    @Res() res: Response,
  ) {
    const messages =
      await this.messagesService.getMessagesByConversation(contract_id);
    if (!messages || messages.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'No messages found for this contract',
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Messages retrieved successfully',
      data: messages,
    });
  }

  @Put(':id/read')
  async markMessageAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const message = await this.messagesService.markAsRead(id);
    if (!message) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Message not found',
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Message marked as read successfully',
      data: message,
    });
  }
}
