import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { ContractProvider } from './contract.provider';
import { ProposalModule } from '../proposal/proposal.module';
import { MessagesModule } from '../messages/messages.module';
import { MilestoneModule } from '../milestone/milestone.module';

@Module({
  imports: [ProposalModule, MessagesModule, MilestoneModule],
  providers: [ContractService, ...ContractProvider],
  controllers: [ContractController],
  exports: [ContractService],
})
export class ContractModule {}
