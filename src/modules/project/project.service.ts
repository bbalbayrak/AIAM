import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROJECT_REPOSITORY } from 'src/config/constants';
import { Project } from './project.entity';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: typeof Project,
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
}
