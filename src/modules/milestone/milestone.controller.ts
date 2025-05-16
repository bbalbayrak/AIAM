import {
  Body,
  Controller,
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
import { MilestoneService } from './milestone.service';
import { MilestoneDto } from './dto/milestone.dto';
import { Response } from 'express';
import { MilestoneStatus } from './milestone.entity';

@UseGuards(JwtAuthGuard)
@Controller('milestone')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Post('')
  async createMilestone(
    @Body() milestoneDto: MilestoneDto,
    @Res() res: Response,
  ) {
    const newMilestone =
      await this.milestoneService.createMilestone(milestoneDto);

    return res.status(HttpStatus.CREATED).json({
      message: 'Milestone created successfully',
      data: newMilestone,
    });
  }

  @Get(':id')
  async getMilestoneById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const milestone = await this.milestoneService.getMilestoneById(id);
    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Milestone retrieved successfully',
      data: milestone,
    });
  }
  @Put(':id')
  async updateMilestone(
    @Param('id', ParseIntPipe) id: number,
    @Body() milestoneDto: MilestoneDto,
    @Res() res: Response,
  ) {
    const milestone = await this.milestoneService.updateMilestone(
      id,
      milestoneDto,
    );
    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
    return res.status(HttpStatus.CREATED).json({
      message: 'Milestone updated successfully',
      data: milestone,
    });
  }

  @Put(':id/status')
  async updateMilestoneStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: MilestoneStatus,
    @Res() res: Response,
  ) {
    const milestone = await this.milestoneService.updateMilestoneStatus(
      id,
      status,
    );
    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
    return res.status(HttpStatus.CREATED).json({
      message: 'Milestone status updated successfully',
      data: milestone,
    });
  }
}
