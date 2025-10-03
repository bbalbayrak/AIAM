import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './invoices.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
