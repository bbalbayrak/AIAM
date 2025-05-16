import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CONTRACT_REPOSITORY } from 'src/config/constants';
import { Contract } from './contract.entity';
import { ContractDto } from './dto/contract.dto';
import { ProposalService } from '../proposal/proposal.service';

@Injectable()
export class ContractService {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contractRepository: typeof Contract,
    private readonly proposalRepository: ProposalService,
  ) {}

  async getAllContracts(): Promise<Contract[]> {
    return await this.contractRepository.findAll<Contract>();
  }

  async getContractById(id: number): Promise<Contract> {
    const contract = await this.contractRepository.findByPk<Contract>(id);
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }
  async createContractAccepted(contractDto: ContractDto): Promise<Contract> {
    const { start_date, end_date, proposal_id } = contractDto;
    const isProposalAccepted =
      await this.proposalRepository.getProposalById(proposal_id);

    if (isProposalAccepted.status !== 'accepted') {
      throw new BadRequestException(
        'Proposal must be accepted before creating a contract',
      );
    }

    const safedto = {
      project_id: isProposalAccepted.project_id,
      agency_id: isProposalAccepted.agency_id,
      ...contractDto,
    };

    if (start_date && end_date) {
      const start = new Date(start_date);
      const end = new Date(end_date);

      if (start > end) {
        throw new BadRequestException(
          'End date cannot be earlier than start date',
        );
      }
    }
    const newContract = await this.contractRepository.create<Contract>(safedto);
    return newContract;
  }

  async updateContract(
    id: number,
    contractDto: ContractDto,
  ): Promise<Contract> {
    const contract = await this.contractRepository.findByPk<Contract>(id);
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    await contract.update(contractDto);
    return contract;
  }

  //async getContractMilestones(){}

  //async getContractMessages(){}
}
