import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Matches,
  IsDateString,
} from 'class-validator';
import { MilestoneStatus } from '../milestone.entity';

export class MilestoneDto {
  @IsNotEmpty({ message: 'Contract ID must not be empty.' })
  @IsNumber({}, { message: 'Contract ID must be a number.' })
  readonly contract_id: number;

  @IsNotEmpty({ message: 'Title must not be empty.' })
  @IsString({ message: 'Title must be a string.' })
  readonly title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  readonly description?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Due Date must be a valid date string in YYYY-MM-DD format' },
  )
  readonly due_date?: Date;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a decimal number with up to 2 decimal places.' },
  )
  readonly amount?: number;

  @IsOptional()
  @IsEnum(MilestoneStatus, {
    message: `Status must be one of the following: ${Object.values(MilestoneStatus).join(', ')}`,
  })
  readonly status?: MilestoneStatus;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Complate Date must be a valid date string in YYYY-MM-DD format',
    },
  )
  readonly completed_at?: Date;
}
