import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SUBSCRIPTIONS_REPOSITORY } from 'src/config/constants';
import Stripe from 'stripe';
import { Subscriptions, SubscriptionStatus } from './subscriptions.entity';
import { UpdateSubscriptionDto } from './dto/updateSubsc.dto';
import { CreateSubscriptionDto } from './dto/subscriptions.dto';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    @Inject(SUBSCRIPTIONS_REPOSITORY)
    private readonly subscriptionsRepository: typeof Subscriptions,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createSub(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscriptions> {
    const { userId, priceId, quantity = 1 } = createSubscriptionDto;

    const stripeSub: Stripe.Subscription =
      await this.stripe.subscriptions.create({
        customer: String(userId), // Stripe Customer ID mapping
        items: [{ price: priceId, quantity }],
        expand: ['latest_invoice.payment_intent'],
      });

    let currentPeriodStart: Date | null = null;
    let currentPeriodEnd: Date | null = null;

    // first try: subscription item level
    const firstItem =
      stripeSub.items?.data && stripeSub.items.data.length > 0
        ? (stripeSub.items.data[0] as any)
        : null;

    if (
      firstItem &&
      (firstItem.current_period_start || firstItem.current_period_end)
    ) {
      if (firstItem.current_period_start)
        currentPeriodStart = new Date(firstItem.current_period_start * 1000);
      if (firstItem.current_period_end)
        currentPeriodEnd = new Date(firstItem.current_period_end * 1000);
    } else {
      // fallback 1: old top-level fields (some accounts / older API versions)
      const topStart = (stripeSub as any).current_period_start;
      const topEnd = (stripeSub as any).current_period_end;
      if (topStart || topEnd) {
        if (topStart) currentPeriodStart = new Date(topStart * 1000);
        if (topEnd) currentPeriodEnd = new Date(topEnd * 1000);
      } else {
        // fallback 2: latest_invoice -> invoice.period_start/period_end (may exist)
        const inv = stripeSub.latest_invoice as
          | Stripe.Invoice
          | string
          | undefined;
        if (inv && typeof inv === 'object' && (inv as any).period_start) {
          const invoice = inv as any;
          if (invoice.period_start)
            currentPeriodStart = new Date(invoice.period_start * 1000);
          if (invoice.period_end)
            currentPeriodEnd = new Date(invoice.period_end * 1000);
        }
      }
    }

    const created = await this.subscriptionsRepository.create({
      userId: createSubscriptionDto.userId,
      providerSubscriptionId: stripeSub.id,
      planType: createSubscriptionDto.planType,
      priceId: createSubscriptionDto.priceId ?? null,
      quantity: createSubscriptionDto.quantity ?? 1,
      status: (stripeSub.status || null) as any,
      currentPeriodStart: currentPeriodStart ?? null,
      currentPeriodEnd: currentPeriodEnd ?? null,
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end ?? false,
    });

    return created;
  }

  async findAllSubs(): Promise<Subscriptions[]> {
    return this.subscriptionsRepository.findAll();
  }

  async findOne(id: number): Promise<Subscriptions> {
    const sub = await this.subscriptionsRepository.findByPk(id);
    if (!sub) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }
    return sub;
  }

  async updateSub(
    id: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscriptions> {
    const sub = await this.findOne(id);

    if (sub.providerSubscriptionId) {
      await this.stripe.subscriptions.update(sub.providerSubscriptionId, {
        cancel_at_period_end: updateSubscriptionDto.cancelAtPeriodEnd,
        items: updateSubscriptionDto.priceId
          ? [{ price: updateSubscriptionDto.priceId }]
          : undefined,
      });
    }

    await sub.update(updateSubscriptionDto);
    return sub;
  }

  async cancelSub(id: number): Promise<Subscriptions> {
    const sub = await this.subscriptionsRepository.findByPk(id);

    if (sub.providerSubscriptionId) {
      const stripeCanceled = await this.stripe.subscriptions.cancel(
        sub.providerSubscriptionId,
      );
      await sub.update({
        status: stripeCanceled.status as SubscriptionStatus,
        canceledAt: new Date(),
      });
    } else {
      await sub.update({
        status: SubscriptionStatus.CANCELED,
        canceledAt: new Date(),
      });
    }

    return sub;
  }

  async deleteSub(id: number): Promise<void> {
    const sub = await this.subscriptionsRepository.findByPk(id);
    if (!sub) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }
    await sub.destroy();
  }
}
