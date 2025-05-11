import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import { ProposalService } from './proposal.service';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { RolesGuard } from 'src/decorators/roles.guard';
import { ProposalDto } from './dto/proposal.dto';
import { Request, Response } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post('')
  async createProposal(@Body() proposalDto: ProposalDto, @Res() res: Response) {
    const newProposal = await this.proposalService.createProposal(proposalDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Proposal created successfully',
      data: newProposal,
    });
  }
  @Get(':id')
  async getProposalById(@Param('id') id: number, @Res() res: Response) {
    const proposal = await this.proposalService.getProposalById(id);
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Proposal retrieved successfully',
      data: proposal,
    });
  }
  @Put(':id')
  async updateProposal(
    @Param('id') id: number,
    @Body() proposalDto: ProposalDto,
    @Res() res: Response,
  ) {
    const proposal = await this.proposalService.updateProposal(id, proposalDto);
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    return res.status(HttpStatus.CREATED).json({
      message: 'Proposal updated successfully',
      data: proposal,
    });
  }
  @Delete(':id')
  async deleteProposal(@Param('id') id: number, @Res() res: Response) {
    const proposal = await this.proposalService.getProposalById(id);
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    try {
      await this.proposalService.deleteProposal(id);
      return res.status(HttpStatus.OK).json({
        message: 'Proposal deleted successfully',
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Put(':id/accept')
  async acceptProposal(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user['userId'];
    const proposal = await this.proposalService.acceptProposal(id, userId);
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Proposal accepted successfully',
      data: proposal,
    });
  }
}
