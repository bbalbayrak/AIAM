import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRICES_REPOSITORY } from 'src/config/constants';
import Stripe from 'stripe';
import { Prices } from './prices.entity';
import { updatePriceDto } from './dto/updatePrices.dto';
import { CreatePriceDto } from './dto/prices.dto';

@Injectable()
export class PricesService {
  private stripe: Stripe;

  constructor(
    @Inject(PRICES_REPOSITORY) private readonly pricesRepository: typeof Prices,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createPrice(createPriceDto: CreatePriceDto): Promise<Prices> {
    const stripePrice = await this.stripe.prices.create({
      unit_amount: createPriceDto.unitAmount,
      currency: createPriceDto.currency,
      product: createPriceDto.productId.toString(),
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

    await price.update(updatePriceDto);

    return price;
  }

  async deletePrice(id: string): Promise<void> {
    const price = await this.pricesRepository.findByPk(id);
    if (!price) {
      throw new NotFoundException(`Price with id ${id} not found`);
    }
    await price.destroy();
  }
}
