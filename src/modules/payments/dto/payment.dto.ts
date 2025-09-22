import {
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsDecimal,
  IsBoolean,
} from 'class-validator';
import { PaymentMethod, PaymentStatus, RefundStatus } from '../payments.entity';

export class CreatePaymentDto {
  @IsNumber({}, { message: 'Project ID must be a number' })
  @IsNotEmpty({ message: 'Project ID is required' })
  readonly project_id: number;

  @IsNumber({}, { message: 'Payer ID must be a number' })
  @IsNotEmpty({ message: 'Payer ID is required' })
  readonly payer_id: number;

  @IsNumber({}, { message: 'Payee ID must be a number' })
  @IsNotEmpty({ message: 'Payee ID is required' })
  readonly payee_id: number;

  @IsNumber({}, { message: 'Amount must be a number' })
  @IsNotEmpty({ message: 'Amount is required' })
  readonly amount: number;

  @IsEnum(PaymentMethod, { message: 'Payment method must be a valid option' })
  readonly payment_method: PaymentMethod;

  @IsEnum(PaymentStatus, { message: 'Payment status must be a valid option' })
  @IsOptional()
  readonly payment_status?: PaymentStatus;

  @IsString({ message: 'Currency must be a string' })
  @IsNotEmpty({ message: 'Currency is required' })
  readonly currency: string;

  @IsString({ message: 'Payment notes must be a string' })
  @IsOptional()
  readonly payment_notes?: string;

  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'Commission fee must be a decimal with up to 2 decimal places' },
  )
  @IsOptional()
  readonly commission_fee?: number;

  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'Platform fee must be a decimal with up to 2 decimal places' },
  )
  @IsOptional()
  readonly platform_fee?: number;

  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'Net amount must be a decimal with up to 2 decimal places' },
  )
  @IsOptional()
  readonly net_amount?: number;

  @IsString({ message: 'Stripe transaction ID must be a string' })
  @IsOptional()
  readonly stripe_transaction_id?: string;

  @IsString({ message: 'Stripe payment method ID must be a string' })
  @IsOptional()
  readonly stripe_payment_method_id?: string;

  @IsString({ message: 'Invoice ID must be a string' })
  @IsOptional()
  readonly invoice_id?: string;

  @IsEnum(RefundStatus, { message: 'Refund status must be a valid option' })
  @IsOptional()
  readonly refund_status?: RefundStatus;

  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'Refund amount must be a decimal with up to 2 decimal places' },
  )
  @IsOptional()
  readonly refund_amount?: number;

  @IsDateString({}, { message: 'Payment date must be a valid ISO date string' })
  @IsOptional()
  readonly payment_date?: string;

  @IsDateString(
    {},
    { message: 'Payment due date must be a valid ISO date string' },
  )
  @IsOptional()
  readonly payment_due_date?: string;

  @IsBoolean({ message: 'is_test_mode must be a boolean value' })
  @IsOptional()
  readonly is_test_mode?: boolean;
}
