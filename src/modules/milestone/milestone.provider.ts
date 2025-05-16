import { MILESTONE_REPOSITORY } from 'src/config/constants';
import { Milestone } from './milestone.entity';

export const MilestoneProvider = [
  {
    provide: MILESTONE_REPOSITORY,
    useValue: Milestone,
  },
];
