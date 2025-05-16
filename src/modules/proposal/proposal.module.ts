import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { ProposalProvider } from './proposal.provider';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [ProposalService, ...ProposalProvider],
  controllers: [ProposalController],
  exports: [ProposalService, ...ProposalProvider],
})
export class ProposalModule {}
