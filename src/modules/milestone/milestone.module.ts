import { Module } from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { MilestoneController } from './milestone.controller';
import { MilestoneProvider } from './milestone.provider';

@Module({
  providers: [MilestoneService, ...MilestoneProvider],
  controllers: [MilestoneController],
  exports: [MilestoneService],
})
export class MilestoneModule {}
