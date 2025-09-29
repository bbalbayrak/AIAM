import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsNumber,
} from 'class-validator';
import { PlanType, SubscriptionStatus } from '../subscriptions.entity';

export class CreateSubscriptionDto {
  @IsOptional()
  @IsString()
  providerSubscriptionId?: string; // Stripe subscription ID

  @IsNumber()
  userId: number;

  @IsEnum(PlanType)
  planType: PlanType;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  priceId?: string;

  @IsNumber()
  price: number; // Foreign key ID

  @IsOptional()
  @IsBoolean()
  cancelAtPeriodEnd?: boolean;

  @IsOptional()
  @IsDate()
  currentPeriodStart?: Date;

  @IsOptional()
  @IsDate()
  currentPeriodEnd?: Date;

  @IsOptional()
  @IsDate()
  endedAt?: Date;

  @IsOptional()
  @IsDate()
  cancelAt?: Date;

  @IsOptional()
  @IsDate()
  canceledAt?: Date;
}
