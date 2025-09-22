import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
  Res,
  HttpStatus,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { CreatePaymentMethodDto } from './dto/payment-methods.dto';
import { Request, Response } from 'express';
import { UpdatePaymentMethodDto } from './dto/updatePayment-methods.dto';

@UseGuards(JwtAuthGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  async create(
    @Body() createDto: CreatePaymentMethodDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user['userId'];

    const newMethod = await this.paymentMethodsService.create(
      createDto,
      userId,
    );
    return res.status(HttpStatus.CREATED).json({
      message: 'Payment method created successfully',
      data: newMethod,
    });
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    const userId = req.user['userId'];

    const methods = await this.paymentMethodsService.findAllByUser(userId);
    if (methods.length === 0 || !methods) {
      throw new NotFoundException('No payment methods found');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Payment methods retrieved successfully',
      data: methods,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user['userId'];
    const method = await this.paymentMethodsService.findOne(id, userId);
    if (!method) {
      throw new NotFoundException('Payment method not found');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Payment method retrieved successfully',
      data: method,
    });
  }

  // 🔹 Güncelle
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePaymentMethodDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user['userId'];

    const updatedMethod = await this.paymentMethodsService.update(
      id,
      userId,
      updateDto,
    );
    if (!updatedMethod) {
      throw new NotFoundException('Payment method not found');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Payment method updated successfully',
      data: updatedMethod,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user['userId'];

    const result = await this.paymentMethodsService.remove(id, userId);

    return res.status(HttpStatus.OK).json({
      message: 'Payment method removed successfully',
      data: result,
    });
  }
}
