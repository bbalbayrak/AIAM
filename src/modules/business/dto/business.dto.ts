import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CompanySize } from '../companySize.enum';

export class BusinessDto {
  @IsNumber({}, { message: 'User ID must be a number' })
  @IsNotEmpty({ message: 'User ID is required' })
  readonly user_id: number;
  @IsString({ message: 'Company name must be a string' })
  readonly industry: string;
  @IsNotEmpty({ message: 'Company size is required' })
  @IsEnum(CompanySize, {
    message:
      'Company size must be one of: 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+',
  })
  readonly company_size: CompanySize;
  @IsString({ message: 'Company name must be a string' })
  readonly annual_revenue_range: string;
  @IsString({ message: 'Company name must be a string' })
  readonly previous_ai_experience: string;
}
