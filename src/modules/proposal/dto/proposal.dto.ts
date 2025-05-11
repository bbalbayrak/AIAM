import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { ProposalStatus } from '../proposal.entity';

export class ProposalDto {
  @IsNumber({}, { message: 'Project ID must be a number' })
  @IsNotEmpty({ message: 'Project ID is required' })
  readonly project_id: number;

  @IsNumber({}, { message: 'Agency ID must be a number' })
  @IsNotEmpty({ message: 'Agency ID is required' })
  readonly agency_id: number;

  @IsString({ message: 'Proposal text must be a string' })
  @IsNotEmpty({ message: 'Proposal text is required' })
  readonly proposal_text: string;

  @IsOptional()
  @IsNumber({}, { message: 'Proposed budget must be a number' })
  readonly proposed_budget?: number;

  @IsOptional()
  @IsString({ message: 'Proposed timeline must be a string' })
  readonly proposed_timeline?: string;

  @IsOptional()
  @IsEnum(ProposalStatus, {
    message: `Status must be one of: ${Object.values(ProposalStatus).join(', ')}`,
  })
  readonly status?: ProposalStatus;
}
