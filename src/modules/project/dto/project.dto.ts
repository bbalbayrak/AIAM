import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ProjectStatus } from '../status.enum';

export class ProjectDto {
  @IsNumber({}, { message: 'Business ID must be a number' })
  @IsNotEmpty({ message: 'Business ID is required' })
  readonly business_id: number;

  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  readonly title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  readonly description: string;

  @IsString({ message: 'Budget range must be a string' })
  @IsNotEmpty({ message: 'Budget range is required' })
  readonly budget_range: string;

  @IsString({ message: 'Timeline must be a string' })
  @IsNotEmpty({ message: 'Timeline is required' })
  readonly timeline: string;

  @IsObject({ message: 'Expertise required must be an object (JSON)' })
  @IsNotEmpty({ message: 'Expertise required is required' })
  readonly expertise_required: Record<string, any>;

  @IsEnum(ProjectStatus, {
    message: `Status must be one of: ${Object.values(ProjectStatus).join(', ')}`,
  })
  @IsOptional()
  readonly status?: ProjectStatus;

  @IsDateString({}, { message: 'Deadline must be a valid ISO date string' })
  @IsOptional()
  readonly deadline?: Date;
}
