import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { InvoicesService } from './invoices.service';
import { Response } from 'express';
import { CreateInvoiceDto } from './dto/invoices.dto';
import { UpdateInvoiceDto } from './dto/updateInvoice.dto';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('all')
  async getAllInvoices(@Res() res: Response) {
    const allInvoices = await this.invoicesService.findAllInvoices();
    if (allInvoices.length === 0 || !allInvoices) {
      throw new NotFoundException('No invoices found');
    }

    return res.status(HttpStatus.OK).json({
      message: 'All invoices retrieved successfully',
      data: allInvoices,
    });
  }

  @Get(':id')
  async getInvoiceById(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const invoice = await this.invoicesService.findOneInvoice(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Invoice retrieved successfully',
      data: invoice,
    });
  }

  @Post('create')
  async createInvoice(
    @Res() res: Response,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    const newInvoice =
      await this.invoicesService.createInvoice(createInvoiceDto);
    if (!newInvoice) {
      throw new NotFoundException('Invoice could not be created');
    }

    return res.status(HttpStatus.CREATED).json({
      message: 'Invoice created successfully',
      data: newInvoice,
    });
  }

  @Put('update/:id')
  async updateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Res() res: Response,
  ) {
    const updatedInvoice = await this.invoicesService.updateInvoice(
      id,
      updateInvoiceDto,
    );
    if (!updatedInvoice) {
      throw new NotFoundException('Invoice could not be updated');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Invoice updated successfully',
      data: updatedInvoice,
    });
  }

  @Delete('delete/:id')
  async deleteInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.invoicesService.removeInvoice(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post('sync/:invoiceId')
  async syncInvoice(
    @Param('invoiceId') invoiceId: string,
    @Res() res: Response,
  ) {
    const syncedInvoice =
      await this.invoicesService.syncInvoiceFromStripe(invoiceId);
    if (!syncedInvoice) {
      throw new NotFoundException('Invoice could not be synced');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Invoice synced successfully',
      data: syncedInvoice,
    });
  }
}
