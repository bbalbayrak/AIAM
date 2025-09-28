import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { PricesService } from './prices.service';
import { Response } from 'express';
import { CreatePriceDto } from './dto/prices.dto';
import { updatePriceDto } from './dto/updatePrices.dto';

@UseGuards(JwtAuthGuard)
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('all')
  async getAllPrices(@Res() res: Response) {
    const prices = await this.pricesService.findAllPrices();

    if (prices.length === 0 || !prices) {
      throw new NotFoundException('No prices found');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Prices Successfully Fetched !',
      data: prices,
    });
  }

  @Get(':id')
  async getPriceById(@Res() res: Response, @Param('id') id: string) {
    const price = await this.pricesService.findOnePrice(id);

    if (!price) {
      throw new NotFoundException('Price not found');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Price Successfully Fetched !',
      data: price,
    });
  }

  @Post('create')
  async createPrice(
    @Body() createPriceDto: CreatePriceDto,
    @Res() res: Response,
  ) {
    const newPrice = await this.pricesService.createPrice(createPriceDto);

    return res.status(HttpStatus.CREATED).json({
      message: 'Price Successfully Created !',
      data: newPrice,
    });
  }

  @Put('update/:id')
  async updatePrice(
    @Param('id') id: string,
    @Body() updatePriceDto: updatePriceDto,
    @Res() res: Response,
  ) {
    const updatedPrice = await this.pricesService.updatePrice(
      id,
      updatePriceDto,
    );

    return res.status(HttpStatus.OK).json({
      message: 'Price Successfully Updated !',
      data: updatedPrice,
    });
  }

  @Delete('delete/:id')
  async deletePrice(@Param('id') id: string, @Res() res: Response) {
    await this.pricesService.deletePrice(id);

    return res.status(HttpStatus.OK).json({
      message: 'Price Successfully Deleted !',
    });
  }
}
