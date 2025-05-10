import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectProvider } from './project.provider';

@Module({
  providers: [ProjectService, ...ProjectProvider],
  controllers: [ProjectController],
})
export class ProjectModule {}
