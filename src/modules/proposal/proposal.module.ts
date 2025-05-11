import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { ProposalProvider } from './proposal.provider';

@Module({
  providers: [ProposalService, ...ProposalProvider],
  controllers: [ProposalController],
})
export class ProposalModule {}
