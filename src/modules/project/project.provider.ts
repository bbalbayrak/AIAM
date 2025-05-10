import { PROJECT_REPOSITORY } from 'src/config/constants';
import { Project } from './project.entity';

export const ProjectProvider = [
  {
    provide: PROJECT_REPOSITORY,
    useValue: Project,
  },
];
