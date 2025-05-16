import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROJECT_REPOSITORY } from 'src/config/constants';
import { Project } from './project.entity';
import { ProjectDto } from './dto/project.dto';
import { Agency } from '../agency/agency.entity';
import { AgencyService } from '../agency/agency.service';
import { Proposal } from '../proposal/proposal.entity';
import { ProposalService } from '../proposal/proposal.service';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: typeof Project,
    private readonly agencyRepository: AgencyService,
    private readonly proposalRepository: ProposalService,
  ) {}

  async getAllProjects(): Promise<Project[]> {
    return await this.projectRepository.findAll<Project>();
  }

  async createProject(projectDto: ProjectDto): Promise<Project> {
    const newProject = await this.projectRepository.create<Project>(projectDto);
    return newProject;
  }

  async getProjectById(id: number): Promise<Project> {
    const project = await this.projectRepository.findByPk<Project>(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async updateProject(id: number, projectDto: ProjectDto): Promise<Project> {
    const project = await this.projectRepository.findByPk<Project>(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    await project.update(projectDto);
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    const project = await this.projectRepository.findByPk<Project>(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    await project.destroy();
  }
  async getProjectProposals(projectId: number) {
    const project = await this.projectRepository.findByPk<Project>(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const proposals =
      await this.proposalRepository.getProposalByProjectId(projectId);
    if (!proposals) {
      throw new NotFoundException(
        `No proposals found for project with ID ${projectId}`,
      );
    }
    return proposals;
  }

  async getMatchedAgencies(projectId: number): Promise<Agency[]> {
    const project = await this.projectRepository.findByPk<Project>(projectId);

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const agencies = await this.agencyRepository.getAllAgencies();

    const projectExpertise = Object.keys(project.expertise_required || {});

    const totalBudget = parseInt(
      project.budget_range.replace(/[^0-9]/g, ''),
      10,
    );

    const estimatedHours = 160;

    const hourlyBudget = totalBudget / estimatedHours;

    const matched = agencies.filter((agency) => {
      const agencyExpertise = Object.keys(agency.expertise_tags || {});
      const hasOverlap = projectExpertise.some((tag) =>
        agencyExpertise.includes(tag),
      );

      return (
        hasOverlap &&
        agency.hourly_rate <= hourlyBudget &&
        agency.projects_completed > 5
      );
    });

    return matched;
  }
}
