import { Inject, Injectable } from '@nestjs/common';
import { Invoices, InvoiceStatus } from '../invoices/invoices.entity';
import { Stripe } from 'stripe';
import {
  INVOICES_REPOSITORY,
  SUBSCRIPTIONS_REPOSITORY,
} from 'src/config/constants';

import {
  PlanType,
  Subscriptions,
  SubscriptionStatus,
} from '../subscriptions/subscriptions.entity';

@Injectable()
export class StripeService {
  public stripe: Stripe;
  constructor(
    @Inject(INVOICES_REPOSITORY)
    private readonly invoicesRepository: typeof Invoices,
    @Inject(SUBSCRIPTIONS_REPOSITORY)
    private readonly subscriptionsRepository: typeof Subscriptions,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async handleInvoicePaid(invoice: Stripe.Invoice) {
    await this.invoicesRepository.update(
      { status: InvoiceStatus.PAID },
      { where: { invoiceId: invoice.id } },
    );
    console.log('Invoice paid:', invoice.id);
  }

  async handleInvoiceFailed(invoice: Stripe.Invoice) {
    await this.invoicesRepository.update(
      { status: InvoiceStatus.UNCOLLECTIBLE },
      { where: { invoiceId: invoice.id } },
    );
    console.log('Invoice payment failed:', invoice.id);
  }

  async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    await this.subscriptionsRepository.create({
      providerSubscriptionId: subscription.id,
      status: subscription.status as SubscriptionStatus,
      planType: PlanType.BASIC,
      userId: 1,
    });
    console.log('Subscription created:', subscription.id);
  }

  async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    await this.subscriptionsRepository.update(
      { status: subscription.status as SubscriptionStatus },
      { where: { providerSubscriptionId: subscription.id } },
    );
    console.log('Subscription updated:', subscription.id);
  }

  async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await this.subscriptionsRepository.update(
      { status: SubscriptionStatus.CANCELED },
      { where: { providerSubscriptionId: subscription.id } },
    );
    console.log('Subscription deleted:', subscription.id);
  }
}
