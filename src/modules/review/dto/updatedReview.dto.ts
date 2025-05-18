import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsNumber,
} from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString({ message: 'review_text must be a string.' })
  readonly review_text?: string;

  @IsOptional()
  @IsNumber({}, { message: 'rating must be a number.' })
  @Min(1, { message: 'rating must be at least 1.' })
  @Max(5, { message: 'rating must be at most 5.' })
  readonly rating?: number;
}
