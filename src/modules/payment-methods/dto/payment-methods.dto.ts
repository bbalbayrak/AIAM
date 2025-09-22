import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty({
    message: 'Provider is required (e.g., stripe, paypal, applepay)',
  })
  provider: string;

  @IsString()
  @IsNotEmpty({
    message: 'Method ID is required (e.g., Stripe PM_xxx, PayPal Billing ID)',
  })
  method_id: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  last4?: string;

  @IsString()
  @IsOptional()
  exp_month?: string;

  @IsString()
  @IsOptional()
  exp_year?: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}
