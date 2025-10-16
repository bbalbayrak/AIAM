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
import { ProductsService } from './products.service';
import { Response } from 'express';
import { ProductDto } from './dto/products.dto';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('all')
  async getAllProducts(@Res() res: Response) {
    const products = await this.productsService.findAllProducts();

    if (products.length === 0 || !products) {
      throw new NotFoundException('No products found');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Products Successfully Fetched !',
      data: products,
    });
  }

  @Get(':id')
  async getProductsById(
    @Param('id', ParseIntPipe) id: string,
    @Res() res: Response,
  ) {
    const product = await this.productsService.findOneProduct(id);

    if (!product) {
      throw new NotFoundException('Product not found !');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Product Successfully Fetched',
      data: product,
    });
  }

  @Post('create')
  async createProduct(
    @Body() createProductDto: ProductDto,
    @Res() res: Response,
  ) {
    const newProduct =
      await this.productsService.createProduct(createProductDto);

    return res.status(HttpStatus.CREATED).json({
      message: 'Product Successfully Created',
      data: newProduct,
    });
  }

  @Put('update/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateProductDto: ProductDto,
    @Res() res: Response,
  ) {
    const product = await this.productsService.updateProduct(
      id,
      updateProductDto,
    );

    if (!product) {
      throw new NotFoundException('Product not found !');
    }

    return res.status(HttpStatus.CREATED).json({
      message: 'Product Successfully Updated !',
      data: product,
    });
  }

  @Put('deactive/:id')
  async deactiveProduct(
    @Param('id', ParseIntPipe) id: string,
    @Res() res: Response,
  ) {
    const product = await this.productsService.deactiveProduct(id);

    return res.status(HttpStatus.OK).json({
      message: 'Product Successfully Deactivated !',
      data: product,
    });
  }

  @Delete('delete/:id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: string,
    @Res() res: Response,
  ) {
    const deletedProduct = await this.productsService.deleteProduct(id);

    return res.status(HttpStatus.OK).json({
      message: 'Product Successfully Deleted !',
      data: deletedProduct,
    });
  }
}
