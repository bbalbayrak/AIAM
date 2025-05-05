import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AgencyService } from './agency.service';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { Response } from 'express';
import { AgencyDto } from './dto/agency.dto';

@UseGuards(JwtAuthGuard)
@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Get()
  async getAllAgencies(@Res() res: Response) {
    const agencies = await this.agencyService.getAllAgencies();
    if (!agencies || agencies.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'No agencies found',
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Agencies retrieved successfully',
      data: agencies,
    });
  }

  @Post()
  async createAgency(@Body() agencyDto: AgencyDto, @Res() res: Response) {
    const agency = await this.agencyService.createAgency(agencyDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Agency created successfully',
      data: agency,
    });
  }

  @Get('top-rated')
  async getTopRatedAgencies(@Res() res: Response) {
    const topRatedAgencies = await this.agencyService.getTopRatedAgencies();
    if (!topRatedAgencies || topRatedAgencies.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'No top-rated agencies found',
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Top-rated agencies retrieved successfully',
      data: topRatedAgencies,
    });
  }

  @Get(':id')
  async getAgencyById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const agency = await this.agencyService.getAgencyById(id);
    if (!agency) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Agency not found',
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Agency retrieved successfully',
      data: agency,
    });
  }

  @Put(':id')
  async updateAgency(
    @Param('id', ParseIntPipe) id: number,
    @Body() agencyDto: AgencyDto,
    @Res() res: Response,
  ) {
    const updatedAgency = await this.agencyService.updateAgency(id, agencyDto);
    if (!updatedAgency) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Agency not found',
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Agency updated successfully',
      data: updatedAgency,
    });
  }
}
