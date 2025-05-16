import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { ContractProvider } from './contract.provider';
import { ProposalModule } from '../proposal/proposal.module';

@Module({
  imports: [ProposalModule],
  providers: [ContractService, ...ContractProvider],
  controllers: [ContractController],
})
export class ContractModule {}
