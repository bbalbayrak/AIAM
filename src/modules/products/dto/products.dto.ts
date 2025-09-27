import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  readonly product_name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  readonly active?: boolean;
}
