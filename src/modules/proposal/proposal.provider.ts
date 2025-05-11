import { PROPOSAL_REPOSITORY } from 'src/config/constants';
import { Proposal } from './proposal.entity';

export const ProposalProvider = [
  {
    provide: PROPOSAL_REPOSITORY,
    useValue: Proposal,
  },
];
