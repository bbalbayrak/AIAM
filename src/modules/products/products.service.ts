import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Products } from './products.entity';
import Stripe from 'stripe';
import { ProductDto } from './dto/products.dto';
import { PRODUCTS_REPOSITORY } from 'src/config/constants';

@Injectable()
export class ProductsService {
  private stripe: Stripe;

  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: typeof Products,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async createProduct(dto: ProductDto): Promise<Products> {
    const stripeProduct = await this.stripe.products.create({
      name: dto.product_name,
      description: dto.description,
      active: dto.active ?? true,
    });

    const product = await this.productsRepository.create({
      product_name: dto.product_name,
      description: dto.description,
      active: dto.active ?? true,
      product_id: stripeProduct.id,
    });

    return product;
  }

  async findAllProducts(): Promise<Products[]> {
    return this.productsRepository.findAll();
  }

  async findOneProduct(id: string): Promise<Products> {
    const product = await this.productsRepository.findByPk(id, {
      include: { all: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: ProductDto,
  ): Promise<Products> {
    const product = await this.productsRepository.findByPk(id);

    await this.stripe.products.update(product.product_id, {
      name: updateProductDto.product_name,
      description: updateProductDto.description,
      active: updateProductDto.active,
    });

    await product.update(updateProductDto);
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productsRepository.findByPk(id);
    await this.stripe.products.update(product.product_id, { active: false });
    await product.destroy();
  }

  async deactiveProduct(id: string): Promise<Products> {
    const product = await this.productsRepository.findByPk(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.stripe.products.update(product.product_id, { active: false });
    await product.update({ active: false });
    return product;
  }
}
