import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Payment, PaymentStatus, RefundStatus } from './payments.entity';
import { CreatePaymentDto } from './dto/payment.dto';
import { PAYMENT_REPOSITORY } from 'src/config/constants';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly PaymentRepository: typeof Payment,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    let stripePaymentIntentId: string | null = null;

    if (dto.payment_method === 'Stripe') {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(dto.amount * 100),
        currency: dto.currency,
        metadata: {
          projectId: dto.project_id,
          payerId: dto.payer_id,
          payeeId: dto.payee_id,
        },
      });
      stripePaymentIntentId = intent.id;
    }
    const payment = await this.PaymentRepository.create({
      ...dto,
      stripe_transaction_id: stripePaymentIntentId,
      payment_status: PaymentStatus.PENDING,
      refund_status: RefundStatus.NOT_REFUNDED,
      payment_date: dto.payment_date ? new Date(dto.payment_date) : new Date(),
      payment_due_date: dto.payment_due_date
        ? new Date(dto.payment_due_date)
        : null,
    });

    return payment;
  }

  async findAllPayments(): Promise<Payment[]> {
    return this.PaymentRepository.findAll();
  }

  async findPaymentById(id: number): Promise<Payment> {
    const payment = await this.PaymentRepository.findByPk(id);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return payment;
  }

  async updatePaymentStatus(
    id: number,
    status: PaymentStatus,
  ): Promise<Payment> {
    const payment = await this.findPaymentById(id);
    payment.payment_status = status;
    await payment.save();
    return payment;
  }

  async refundPayment(id: number, amount?: number): Promise<Payment> {
    const payment = await this.findPaymentById(id);

    if (payment.payment_method === 'Stripe' && payment.stripe_transaction_id) {
      await this.stripe.refunds.create({
        payment_intent: payment.stripe_transaction_id,
        amount: amount ? Math.round(amount * 100) : undefined,
      });
    }

    payment.refund_status = amount
      ? RefundStatus.PARTIALLY_REFUNDED
      : RefundStatus.REFUNDED;

    if (amount) {
      payment.refund_amount = amount;
    } else {
      payment.refund_amount = payment.amount;
    }

    payment.payment_status = PaymentStatus.REFUNDED;

    await payment.save();
    return payment;
  }
}
