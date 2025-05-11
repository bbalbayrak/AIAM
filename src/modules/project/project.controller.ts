import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Response } from 'express';
import { ProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('')
  async getAllProjects(@Res() res: Response) {
    const projects = await this.projectService.getAllProjects();
    if (!projects || projects.length === 0) {
      throw new NotFoundException('No projects found');
    }
    return res.status(HttpStatus.OK).json({
      message: 'All projects retrieved successfully',
      data: projects,
    });
  }
  @Post('')
  async createProject(@Body() projectDto: ProjectDto, @Res() res: Response) {
    const newProject = await this.projectService.createProject(projectDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Project created successfully',
      data: newProject,
    });
  }

  @Get(':id')
  async getProjectById(@Param('id') id: number, @Res() res: Response) {
    const project = await this.projectService.getProjectById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Project retrieved successfully',
      data: project,
    });
  }

  @Put(':id')
  async updateProject(
    @Param('id') id: number,
    @Body() updateProjectDto: ProjectDto,
    @Res() res: Response,
  ) {
    const project = await this.projectService.updateProject(
      id,
      updateProjectDto,
    );
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Project updated successfully',
      data: project,
    });
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: number, @Res() res: Response) {
    try {
      await this.projectService.deleteProject(id);
      return res.status(HttpStatus.OK).json({
        message: 'Project deleted successfully',
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
