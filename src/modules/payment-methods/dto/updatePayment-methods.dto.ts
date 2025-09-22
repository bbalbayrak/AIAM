import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdatePaymentMethodDto {
  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  last4?: string;

  @IsString()
  @IsOptional()
  exp_month?: string;

  @IsString()
  @IsOptional()
  exp_year?: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}
