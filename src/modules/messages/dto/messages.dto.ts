import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class MessageDto {
  @IsNumber({}, { message: 'Contract ID must be a number.' })
  @IsNotEmpty({ message: 'Contract ID must not be empty.' })
  readonly contract_id: number;

  @IsNumber({}, { message: 'Sender ID must be a number.' })
  @IsNotEmpty({ message: 'Sender ID must not be empty.' })
  readonly sender_id: number;

  @IsString({ message: 'Content must be a string.' })
  @IsNotEmpty({ message: 'Content must not be empty.' })
  readonly content: string;

  @IsOptional()
  readonly read_at?: Date;
}
