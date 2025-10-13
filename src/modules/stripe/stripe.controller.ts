import {
  Controller,
  Post,
  Headers,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

@Controller('webhooks')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      event = this.stripeService.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      console.error('Webhook error:', err.message);
      throw new HttpException(
        `Webhook Error: ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    switch (event.type) {
      case 'invoice.paid':
        await this.stripeService.handleInvoicePaid(
          event.data.object as Stripe.Invoice,
        );
        break;
      case 'invoice.payment_failed':
        await this.stripeService.handleInvoiceFailed(
          event.data.object as Stripe.Invoice,
        );
        break;
      case 'customer.subscription.created':
        await this.stripeService.handleSubscriptionCreated(
          event.data.object as Stripe.Subscription,
        );
        break;
      case 'customer.subscription.updated':
        await this.stripeService.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;
      case 'customer.subscription.deleted':
        await this.stripeService.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send({ received: true });
  }
}
