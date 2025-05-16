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
import { ContractService } from './contract.service';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { Response } from 'express';
import { ContractDto } from './dto/contract.dto';

@UseGuards(JwtAuthGuard)
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get('')
  async getAllContracts(@Res() res: Response) {
    const contracts = await this.contractService.getAllContracts();

    if (!contracts || contracts.length === 0) {
      throw new NotFoundException('No contracts found');
    }
    return res.status(HttpStatus.OK).json({
      message: 'All contracts retrieved successfully',
      data: contracts,
    });
  }

  @Get(':id')
  async getContractById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const contract = await this.contractService.getContractById(id);
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Contract retrieved successfully',
      data: contract,
    });
  }

  @Post('')
  async createContractAccepted(
    @Body() contractDto: ContractDto,
    @Res() res: Response,
  ) {
    const newContract =
      await this.contractService.createContractAccepted(contractDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Contract created successfully',
      data: newContract,
    });
  }

  @Put(':id')
  async updateContract(
    @Param('id', ParseIntPipe) id: number,
    @Body() contractDto: ContractDto,
    @Res() res: Response,
  ) {
    const contract = await this.contractService.updateContract(id, contractDto);
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return res.status(HttpStatus.CREATED).json({
      message: 'Contract updated successfully',
      data: contract,
    });
  }
}
