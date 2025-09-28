import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PricingType, PricingPlanInterval, PlanType } from '../prices.entity';

export class CreatePriceDto {
  @IsString()
  @IsNotEmpty()
  priceId: string;

  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  unitAmount: number;
  x;

  @IsString()
  @IsNotEmpty()
  currency: string; // örn. "usd"

  @IsEnum(PricingType)
  pricingType: PricingType;

  @IsOptional()
  @IsEnum(PricingPlanInterval)
  pricingPlanInterval?: PricingPlanInterval;

  @IsOptional()
  @IsNumber()
  intervalCount?: number;

  @IsEnum(PlanType)
  type: PlanType;
}
