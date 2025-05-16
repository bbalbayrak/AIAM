import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MILESTONE_REPOSITORY } from 'src/config/constants';
import { Milestone, MilestoneStatus } from './milestone.entity';
import { MilestoneDto } from './dto/milestone.dto';

@Injectable()
export class MilestoneService {
  constructor(
    @Inject(MILESTONE_REPOSITORY)
    private readonly milestoneRepository: typeof Milestone,
  ) {}

  async createMilestone(milestoneDto: MilestoneDto): Promise<Milestone> {
    const newMilestone =
      await this.milestoneRepository.create<Milestone>(milestoneDto);
    return newMilestone;
  }

  async getMilestoneById(id: number): Promise<Milestone> {
    const milestone = await this.milestoneRepository.findByPk<Milestone>(id);
    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
    return milestone;
  }

  async updateMilestone(
    id: number,
    milestoneDto: MilestoneDto,
  ): Promise<Milestone> {
    const milestone = await this.milestoneRepository.findByPk<Milestone>(id);
    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
    await milestone.update(milestoneDto);
    return milestone;
  }
  async updateMilestoneStatus(
    id: number,
    status: MilestoneStatus,
  ): Promise<Milestone> {
    const milestone = await this.milestoneRepository.findByPk<Milestone>(id);
    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
    await milestone.update({ status });
    return milestone;
  }

  //async payMilestone(id: number) {}
}
