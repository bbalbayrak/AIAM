import {
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class ReviewDto {
  @IsNumber({}, { message: 'contract_id must be a number.' })
  @IsNotEmpty({ message: 'contract_id is required.' })
  readonly contract_id: number;

  @IsNumber({}, { message: 'reviewer_id must be a number.' })
  @IsNotEmpty({ message: 'reviewer_id is required.' })
  readonly reviewer_id: number;

  @IsNumber({}, { message: 'reviewee_id must be a number.' })
  @IsNotEmpty({ message: 'reviewee_id is required.' })
  readonly reviewee_id: number;

  @IsNumber({}, { message: 'rating must be a number.' })
  @Min(1, { message: 'rating must be at least 1.' })
  @Max(5, { message: 'rating must be at most 5.' })
  @IsNotEmpty({ message: 'rating is required.' })
  readonly rating: number;

  @IsOptional()
  @IsString({ message: 'review_text must be a string.' })
  readonly review_text?: string;
}
