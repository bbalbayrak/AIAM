import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PricingType, PricingPlanInterval, PlanType } from '../prices.entity';

export class CreatePriceDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  unitAmount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

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

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
