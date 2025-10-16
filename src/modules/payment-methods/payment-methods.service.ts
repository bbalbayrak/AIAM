import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import {
  PAYMENT_METHODS_REPOSITORY,
  USER_REPOSITORY,
} from 'src/config/constants';
import { PaymentMethod } from './payment-methods.entity';
import { CreatePaymentMethodDto } from './dto/payment-methods.dto';
import { UpdatePaymentMethodDto } from './dto/updatePayment-methods.dto';
import Stripe from 'stripe';
import { User } from '../user/user.entity';

@Injectable()
export class PaymentMethodsService {
  private stripe: Stripe;

  constructor(
    @Inject(PAYMENT_METHODS_REPOSITORY)
    private readonly paymentMethodRepository: typeof PaymentMethod,
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async createDB(
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

  async createPaymentMethodWithoutClientSide(
    userId: number,
    dto: CreatePaymentMethodDto,
    token: string,
  ): Promise<PaymentMethod> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');

    if (!user.stripe_customer_id) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.contactName || user.companyName || undefined,
      });
      user.stripe_customer_id = customer.id;
      await user.save();
    }

    let stripePm: Stripe.PaymentMethod;
    try {
      stripePm = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token: token },
      } as Stripe.PaymentMethodCreateParams);
    } catch (err) {
      throw new BadRequestException(`Stripe Error: ${err.message}`);
    }

    await this.stripe.paymentMethods.attach(stripePm.id, {
      customer: user.stripe_customer_id,
    });

    const newPm = await this.paymentMethodRepository.create({
      user_id: userId,
      provider: 'stripe',
      method_id: stripePm.id,
      brand: stripePm.card?.brand,
      last4: stripePm.card?.last4,
      exp_month: stripePm.card?.exp_month?.toString(),
      exp_year: stripePm.card?.exp_year?.toString(),
      is_default: dto.is_default ?? false,
    });

    return newPm;
  }

  async createPaymentMethod(
    userId: number,
    dto: CreatePaymentMethodDto,
    cardNumber: string,
    expMonth: string,
    expYear: string,
    cvc: string,
  ): Promise<PaymentMethod> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');

    if (!user.stripe_customer_id) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.contactName || user.companyName || undefined,
      });
      user.stripe_customer_id = customer.id;
      await user.save();
    }

    let stripePm: Stripe.PaymentMethod;
    try {
      stripePm = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardNumber,
          exp_month: Number(expMonth),
          exp_year: Number(expYear),
          cvc: cvc,
        },
      } as Stripe.PaymentMethodCreateParams);
    } catch (err) {
      throw new BadRequestException(`Stripe Error: ${err.message}`);
    }

    await this.stripe.paymentMethods.attach(stripePm.id, {
      customer: user.stripe_customer_id,
    });

    const newPm = await this.paymentMethodRepository.create({
      user_id: userId,
      provider: 'stripe',
      method_id: stripePm.id,
      brand: stripePm.card?.brand,
      last4: stripePm.card?.last4,
      exp_month: stripePm.card?.exp_month?.toString(),
      exp_year: stripePm.card?.exp_year?.toString(),
      is_default: dto.is_default ?? false,
    });

    return newPm;
  }

  async findAllByUser(userId: number): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.findAll({ where: { user_id: userId } });
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
    if (method.provider === 'stripe' && method.method_id) {
      await this.stripe.paymentMethods.detach(method.method_id);
    }
    await method.destroy();
  }
}
