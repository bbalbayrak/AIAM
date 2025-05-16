import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROPOSAL_REPOSITORY } from 'src/config/constants';
import { Proposal, ProposalStatus } from './proposal.entity';
import { ProposalDto } from './dto/proposal.dto';
import { UserService } from '../user/user.service';
import { UserType } from '../user/userType';

@Injectable()
export class ProposalService {
  constructor(
    @Inject(PROPOSAL_REPOSITORY)
    private readonly proposalRepository: typeof Proposal,
    private readonly userService: UserService,
  ) {}

  async createProposal(proposalDto: ProposalDto): Promise<Proposal> {
    const newProposal =
      await this.proposalRepository.create<Proposal>(proposalDto);
    return newProposal;
  }
  async getProposalById(id: number): Promise<Proposal> {
    const proposal = await this.proposalRepository.findByPk<Proposal>(id);
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    return proposal;
  }
  async updateProposal(
    id: number,
    proposalDto: ProposalDto,
  ): Promise<Proposal> {
    const proposal = await this.proposalRepository.findByPk<Proposal>(id);
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    await proposal.update(proposalDto);
    return proposal;
  }

  async deleteProposal(id: number): Promise<Proposal> {
    const proposal = await this.proposalRepository.findByPk<Proposal>(id);
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    await proposal.destroy();
    return proposal;
  }

  async acceptProposal(id: number, userId: number): Promise<Proposal> {
    const proposal = await this.proposalRepository.findByPk<Proposal>(id);
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    const userWhoAccept = await this.userService.getUserById(userId);
    if (userWhoAccept.userType !== UserType.BUSINESS) {
      throw new BadRequestException(
        `Only users with type 'business' can accept a proposal`,
      );
    }
    proposal.status = ProposalStatus.ACCEPTED;
    await proposal.save();
    return proposal;
  }

  async getProposalByProjectId(projectId: number): Promise<Proposal> {
    const proposal = await this.proposalRepository.findOne<Proposal>({
      where: { project_id: projectId },
    });
    if (!proposal) {
      throw new NotFoundException(
        `Proposal with project ID ${projectId} not found`,
      );
    }
    return proposal;
  }
}
