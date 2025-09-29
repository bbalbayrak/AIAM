import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { SubscriptionsService } from './subscriptions.service';
import { Response } from 'express';
import { CreateSubscriptionDto } from './dto/subscriptions.dto';

@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('all')
  async getAllSubscriptions(@Res() res: Response) {
    const subs = await this.subscriptionsService.findAllSubs();
    if (!subs || subs.length === 0) {
      throw new NotFoundException('No subscriptions found');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Subscriptions Successfully Fetched !',
      data: subs,
    });
  }

  @Get(':userId')
  async getSubscriptionByUserId(
    @Res() res: Response,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const sub = await this.subscriptionsService.findOne(userId);
    if (!sub) {
      throw new NotFoundException(
        `No subscription found for user with id ${userId}`,
      );
    }
    return res.status(HttpStatus.OK).json({
      message: 'Subscription Successfully Fetched !',
      data: sub,
    });
  }

  @Post('create')
  async createSubscription(
    @Res() res: Response,
    @Body() createSubDto: CreateSubscriptionDto,
  ) {
    const createdSub = await this.subscriptionsService.createSub(createSubDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Subscription Successfully Created !',
      data: createdSub,
    });
  }

  @Put('update/:id')
  async updateSubscription(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubDto: Partial<CreateSubscriptionDto>,
  ) {
    const updatedSub = await this.subscriptionsService.updateSub(
      id,
      updateSubDto,
    );
    return res.status(HttpStatus.OK).json({
      message: 'Subscription Successfully Updated !',
      data: updatedSub,
    });
  }

  @Put('cancel/:id')
  async cancelSubscription(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const canceledSub = await this.subscriptionsService.cancelSub(id);
    return res.status(HttpStatus.OK).json({
      message: 'Subscription Successfully Canceled !',
      data: canceledSub,
    });
  }

  @Delete('delete/:id')
  async deleteSubscription(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.subscriptionsService.deleteSub(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
