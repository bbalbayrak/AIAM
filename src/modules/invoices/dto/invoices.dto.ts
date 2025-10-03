import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { InvoiceStatus } from '../invoices.entity';

export class CreateInvoiceDto {
  @IsNumber({}, { message: 'User ID must be a number.' })
  @IsNotEmpty({ message: 'User ID is required.' })
  readonly userId: number;

  @IsNumber({}, { message: 'Subscription ID must be a number.' })
  @IsOptional()
  readonly subscriptionId?: number;

  @IsNumber({}, { message: 'Amount due must be a number.' })
  @IsNotEmpty({ message: 'Amount due is required.' })
  readonly amountDue: number;

  @IsString({ message: 'Currency must be a string.' })
  @IsNotEmpty({ message: 'Currency is required.' })
  readonly currency: string;

  @IsEnum(InvoiceStatus, { message: 'Invalid invoice status.' })
  @IsOptional()
  readonly status?: InvoiceStatus;

  @IsDateString({}, { message: 'Due date must be a valid ISO date string.' })
  @IsOptional()
  readonly dueDate?: Date;

  @IsDateString({}, { message: 'Paid date must be a valid ISO date string.' })
  @IsOptional()
  readonly paidAt?: Date;
}
