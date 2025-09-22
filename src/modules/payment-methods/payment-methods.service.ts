import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { PAYMENT_METHODS_REPOSITORY } from 'src/config/constants';
import { PaymentMethod } from './payment-methods.entity';
import { CreatePaymentMethodDto } from './dto/payment-methods.dto';
import { UpdatePaymentMethodDto } from './dto/updatePayment-methods.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @Inject(PAYMENT_METHODS_REPOSITORY)
    private readonly paymentMethodRepository: typeof PaymentMethod,
  ) {}

  async create(
    createPaymentMethodDto: CreatePaymentMethodDto,
    userId: number,
  ): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepository.create({
      ...createPaymentMethodDto,
      user_id: userId,
    });

    if (createPaymentMethodDto.is_default) {
      await this.paymentMethodRepository.update(
        { is_default: false },
        {
          where: {
            user_id: userId,
            id: { [Op.ne]: paymentMethod.id },
          },
        },
      );
    }

    return paymentMethod;
  }

  async findAllByUser(userId: number): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.findAll({ where: { user_id: userId } }); // 👈
  }

  async findOne(id: number, userId: number): Promise<PaymentMethod> {
    const method = await this.paymentMethodRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!method) {
      throw new NotFoundException('Payment method not found');
    }
    return method;
  }

  async update(
    id: number,
    userId: number,
    updateDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const method = await this.findOne(id, userId);

    await method.update(updateDto);

    if (updateDto.is_default) {
      await this.paymentMethodRepository.update(
        { is_default: false },
        {
          where: {
            user_id: userId,
            id: { [Op.ne]: method.id },
          },
        },
      );
    }

    return method;
  }

  async remove(id: number, userId: number): Promise<void> {
    const method = await this.findOne(id, userId);
    await method.destroy();
  }
}
