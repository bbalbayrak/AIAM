import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectProvider } from './project.provider';
import { AgencyModule } from '../agency/agency.module';
import { ProposalModule } from '../proposal/proposal.module';

@Module({
  imports: [AgencyModule, ProposalModule],
  providers: [ProjectService, ...ProjectProvider],
  controllers: [ProjectController],
})
export class ProjectModule {}
