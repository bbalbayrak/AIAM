import {
  Body,
  Controller,
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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { Response } from 'express';
import { PaymentStatus } from './payments.entity';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Res() res: Response,
  ) {
    const payment = await this.paymentsService.createPayment(createPaymentDto);

    return res.status(HttpStatus.CREATED).json({
      message: 'Payment created successfully',
      PaymentInfo: payment,
    });
  }

  @Get('all')
  async getAllPayments(@Res() res: Response) {
    const payments = await this.paymentsService.findAllPayments();

    if (payments.length === 0 || payments === null || !payments) {
      throw new NotFoundException('No payments found');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Payments retrieved successfully',
      Payments: payments,
    });
  }

  @Get(':id')
  async getPaymentById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const payment = await this.paymentsService.findPaymentById(id);

    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    return res.status(HttpStatus.OK).json({
      message: 'Payment retrieved successfully',
      Payment: payment,
    });
  }

  @Put(':id/updateStatus')
  async updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: PaymentStatus,
    @Res() res: Response,
  ) {
    const updatedPayment = await this.paymentsService.updatePaymentStatus(
      id,
      status,
    );

    if (!updatedPayment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    return res.status(HttpStatus.OK).json({
      message: 'Payment status updated successfully',
      Payment: updatedPayment,
    });
  }

  @Post(':id/refund')
  async refundPayment(
    @Body('amount') amount: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const refundedPayment = await this.paymentsService.refundPayment(
      id,
      amount,
    );

    if (!refundedPayment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    return res.status(HttpStatus.OK).json({
      message: 'Payment refunded successfully',
      Payment: refundedPayment,
    });
  }
}
