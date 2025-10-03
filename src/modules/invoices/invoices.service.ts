import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INVOICES_REPOSITORY } from 'src/config/constants';
import Stripe from 'stripe';
import { Invoices, InvoiceStatus } from './invoices.entity';
import { CreateInvoiceDto } from './dto/invoices.dto';
import { UpdateInvoiceDto } from './dto/updateInvoice.dto';

@Injectable()
export class InvoicesService {
  private stripe: Stripe;

  constructor(
    @Inject(INVOICES_REPOSITORY)
    private readonly invoicesRepository: typeof Invoices,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoices> {
    const stripeInvoice = await this.stripe.invoices.create({
      customer: createInvoiceDto.userId.toString(),
      auto_advance: true,
      collection_method: 'charge_automatically',
    });

    return this.invoicesRepository.create({
      ...createInvoiceDto,
      invoiceId: stripeInvoice.id,
      status: stripeInvoice.status as InvoiceStatus,
      dueDate: stripeInvoice.due_date
        ? new Date(stripeInvoice.due_date * 1000)
        : null,
      paidAt:
        stripeInvoice.status === 'paid' &&
        stripeInvoice.status_transitions?.paid_at
          ? new Date(stripeInvoice.status_transitions.paid_at * 1000)
          : null,
    });
  }

  async findAllInvoices(): Promise<Invoices[]> {
    return this.invoicesRepository.findAll();
  }

  async findOneInvoice(id: number): Promise<Invoices> {
    const invoice = await this.invoicesRepository.findByPk(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async updateInvoice(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoices> {
    const invoice = await this.invoicesRepository.findByPk(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice.update(updateInvoiceDto);
  }

  async removeInvoice(id: number): Promise<void> {
    const invoice = await this.invoicesRepository.findByPk(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    await invoice.destroy();
  }

  async syncInvoiceFromStripe(invoiceId: string): Promise<Invoices> {
    const stripeInvoice = (await this.stripe.invoices.retrieve(
      invoiceId,
    )) as Stripe.Invoice & {
      subscription?: string | null;
    };

    let invoice = await this.invoicesRepository.findOne({
      where: { invoiceId },
    });

    if (invoice) {
      return invoice.update({
        status: stripeInvoice.status as InvoiceStatus,
        amountDue: stripeInvoice.amount_due,
        currency: stripeInvoice.currency,
        dueDate: stripeInvoice.due_date
          ? new Date(stripeInvoice.due_date * 1000)
          : null,
        paidAt:
          stripeInvoice.status === 'paid' &&
          stripeInvoice.status_transitions?.paid_at
            ? new Date(stripeInvoice.status_transitions.paid_at * 1000)
            : null,
      });
    } else {
      return this.invoicesRepository.create({
        invoiceId: stripeInvoice.id,
        userId: parseInt(stripeInvoice.customer?.toString() ?? '0', 10),
        subscriptionId: stripeInvoice.subscription
          ? parseInt(stripeInvoice.subscription.toString(), 10)
          : null,
        amountDue: stripeInvoice.amount_due,
        currency: stripeInvoice.currency,
        status: stripeInvoice.status as InvoiceStatus,
        dueDate: stripeInvoice.due_date
          ? new Date(stripeInvoice.due_date * 1000)
          : null,
        paidAt:
          stripeInvoice.status === 'paid' &&
          stripeInvoice.status_transitions?.paid_at
            ? new Date(stripeInvoice.status_transitions.paid_at * 1000)
            : null,
      });
    }
  }
}
