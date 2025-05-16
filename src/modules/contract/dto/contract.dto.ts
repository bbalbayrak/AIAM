import {
  IsInt,
  IsNumber,
  IsOptional,
  IsDateString,
  IsString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { ContractStatus } from '../contract.entity';

export class CreateContractDto {
  @IsNotEmpty({ message: 'Project ID is required' })
  @IsNumber({}, { message: 'Project ID must be an number' })
  readonly project_id: number;
  @IsNotEmpty({ message: 'Proposal ID is required' })
  @IsNumber({}, { message: 'Proposal ID must be an number' })
  readonly proposal_id: number;
  @IsNotEmpty({ message: 'Business ID is required' })
  @IsNumber({}, { message: 'Business ID must be an number' })
  readonly business_id: number;
  @IsNotEmpty({ message: 'Agency ID is required' })
  @IsNumber({}, { message: 'Agency ID must be an number' })
  readonly agency_id: number;

  @IsOptional()
  @IsNumber({}, { message: 'Agreed budget must be a number' })
  readonly agreed_budget: number;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Start date must be a valid date string in YYYY-MM-DD format' },
  )
  readonly start_date?: Date;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'End date must be a valid date string in YYYY-MM-DD format' },
  )
  readonly end_date?: Date;

  @IsOptional()
  @IsString({ message: 'Terms and conditions must be a string' })
  readonly terms_and_conditions?: string;

  @IsOptional()
  @IsEnum(ContractStatus, {
    message: `Status must be one of: ${Object.values(ContractStatus).join(', ')}`,
  })
  readonly status?: ContractStatus;
}
