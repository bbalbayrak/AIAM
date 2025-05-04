import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  Min,
  Max,
} from 'class-validator';
export class AgencyDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  readonly user_id: number;

  @IsOptional()
  @IsObject({ message: 'Expertise tags must be an object' })
  readonly expertise_tags?: Record<string, any>;

  @IsOptional()
  @IsNumber({}, { message: 'Hourly rate must be a number' })
  readonly hourly_rate?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Minimum project size must be a number' })
  readonly min_project_size?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Team size must be a number' })
  readonly team_size?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Years of experience must be a number' })
  readonly years_experience?: number;

  @IsOptional()
  @IsObject({ message: 'Portfolio URLs must be an object' })
  readonly portfolio_urls?: Record<string, any>;

  @IsOptional()
  @IsObject({ message: 'Client references must be an object' })
  readonly client_references?: Record<string, any>;

  @IsOptional()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(0, { message: 'Rating cannot be less than 0' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  readonly rating?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Projects completed must be a number' })
  readonly projects_completed?: number;

  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  readonly location?: string;

  @IsOptional()
  @IsObject({ message: 'Languages spoken must be an object' })
  readonly languages_spoken?: Record<string, any>;

  @IsOptional()
  @IsObject({ message: 'Certifications must be an object' })
  readonly certifications?: Record<string, any>;
}
