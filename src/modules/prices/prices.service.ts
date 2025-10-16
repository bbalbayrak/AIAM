import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRICES_REPOSITORY, PRODUCTS_REPOSITORY } from 'src/config/constants';
import Stripe from 'stripe';
import { Prices } from './prices.entity';
import { updatePriceDto } from './dto/updatePrices.dto';
import { CreatePriceDto } from './dto/prices.dto';
import { Products } from '../products/products.entity';

@Injectable()
export class PricesService {
  private stripe: Stripe;

  constructor(
    @Inject(PRICES_REPOSITORY) private readonly pricesRepository: typeof Prices,
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: typeof Products,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async createPrice(createPriceDto: CreatePriceDto): Promise<Prices> {
    const prod = await this.productsRepository.findByPk(
      createPriceDto.productId,
    );
    if (!prod) {
      throw new NotFoundException(
        `Product with id ${createPriceDto.productId} not found`,
      );
    }
    const stripePrice = await this.stripe.prices.create({
      unit_amount: Math.round(createPriceDto.unitAmount * 100),
      currency: createPriceDto.currency,
      product: prod.product_id.toString(),
      recurring:
        createPriceDto.pricingType === 'recurring'
          ? {
              interval: createPriceDto.pricingPlanInterval,
              interval_count: createPriceDto.intervalCount,
            }
          : undefined,
    });

    const price = await this.pricesRepository.create({
      ...createPriceDto,
      priceId: stripePrice.id,
    });

    return price;
  }

  async findAllPrices(): Promise<Prices[]> {
    return this.pricesRepository.findAll({ include: { all: true } });
  }

  async findOnePrice(id: string): Promise<Prices> {
    const price = await this.pricesRepository.findByPk(id, {
      include: { all: true },
    });
    if (!price) {
      throw new NotFoundException(`Price with id ${id} not found`);
    }
    return price;
  }

  async updatePrice(
    id: string,
    updatePriceDto: updatePriceDto,
  ): Promise<Prices> {
    const price = await this.pricesRepository.findByPk(id);
    if (!price) {
      throw new NotFoundException(`Price with id ${id} not found`);
    }

    const prod = await this.productsRepository.findByPk(price.productId);
    if (!prod) {
      throw new NotFoundException(
        `Product with id ${price.productId} not found`,
      );
    }

    const newStripePrice = await this.stripe.prices.create({
      unit_amount: Math.round(updatePriceDto.unitAmount * 100),
      currency: updatePriceDto.currency,
      product: prod.product_id.toString(),
      recurring:
        updatePriceDto.pricingType === 'recurring'
          ? {
              interval: updatePriceDto.pricingPlanInterval,
              interval_count: updatePriceDto.intervalCount,
            }
          : undefined,
    });

    const newPrice = await this.pricesRepository.create({
      productId: price.productId,
      description: updatePriceDto.description ?? price.description,
      unitAmount: updatePriceDto.unitAmount ?? price.unitAmount,
      currency: updatePriceDto.currency ?? price.currency,
      pricingType: updatePriceDto.pricingType ?? price.pricingType,
      pricingPlanInterval:
        updatePriceDto.pricingPlanInterval ?? price.pricingPlanInterval,
      intervalCount: updatePriceDto.intervalCount ?? price.intervalCount,
      type: updatePriceDto.type ?? price.type,
      priceId: newStripePrice.id,
      active: updatePriceDto.active ?? price.active,
    });

    await price.update({
      description: `${price.description || ''} (Archived)`,
      active: false,
    });

    return newPrice;
  }

  async activatePrice(id: string): Promise<Prices> {
    const price = await this.pricesRepository.findByPk(id);
    if (!price) {
      throw new NotFoundException(`Price with id ${id} not found`);
    }
    await this.stripe.prices.update(price.priceId, { active: true });
    await price.update({ active: true });
    return price;
  }

  async deletePrice(id: string): Promise<void> {
    const price = await this.pricesRepository.findByPk(id);
    if (!price) {
      throw new NotFoundException(`Price with id ${id} not found`);
    }
    await this.stripe.prices.update(price.priceId, { active: false });
    await price.update({ active: false });
    // await price.destroy();
  }
}
