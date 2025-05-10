import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { RolesGuard } from 'src/decorators/roles.guard';
import { BusinessService } from './business.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserStatus } from '../user/userType';
import { Request, Response } from 'express';
import { BusinessDto } from './dto/business.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('')
  @Roles(UserStatus.ADMIN)
  async getAllBusinesses(@Res() res: Response, @Req() req: Request) {
    const businesses = await this.businessService.getAllBusinesses();
    if (!businesses || businesses.length === 0) {
      throw new NotFoundException('No businesses found');
    }
    return res.status(HttpStatus.OK).json({
      message: 'All businesses retrieved successfully',
      data: businesses,
    });
  }

  @Post('')
  async createBusiness(@Body() businessDto: BusinessDto, @Res() res: Response) {
    const newBusiness = await this.businessService.createBusiness(businessDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Business created successfully',
      data: newBusiness,
    });
  }
  @Get(':id')
  async getBusinessById(@Param('id') id: number, @Res() res: Response) {
    const business = await this.businessService.getBusinessById(id);
    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Business retrieved successfully',
      data: business,
    });
  }

  @Put(':id')
  async updateBusiness(
    @Param('id') id: number,
    @Body() updateBusinessDto: BusinessDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const business = await this.businessService.updateBusiness(
      id,
      updateBusinessDto,
    );
    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Business updated successfully',
      data: business,
    });
  }
}
