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
import { MilestoneService } from '../milestone/milestone.service';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class ContractService {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contractRepository: typeof Contract,
    private readonly proposalService: ProposalService,
    private readonly milestoneService: MilestoneService,
    private readonly messageService: MessagesService,
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
      await this.proposalService.getProposalById(proposal_id);

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

  async getContractMilestones(contractId: number) {
    const milestones =
      await this.milestoneService.getMilestonesByContractId(contractId);

    if (!milestones || milestones.length === 0) {
      throw new NotFoundException(
        `No milestones found for contract ID ${contractId}`,
      );
    }
    return milestones;
  }

  async getContractMessages(contractId: number) {
    const messages =
      await this.messageService.getMessagesByConversation(contractId);

    if (!messages || messages.length === 0) {
      throw new NotFoundException(
        `No messages found for contract ID ${contractId}`,
      );
    }
    return messages;
  }
}
