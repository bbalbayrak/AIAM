import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { UserStatus, UserType } from '../userType';

export class UserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  readonly password: string;

  @IsNotEmpty({ message: 'User type is required' })
  @IsEnum(UserType, { message: 'User type must be either BUSINESS or AGENCY' })
  readonly userType: UserType;

  @IsOptional()
  @IsString({ message: 'Company name must be a string' })
  readonly companyName?: string;

  @IsOptional()
  @IsString({ message: 'Contact name must be a string' })
  readonly contactName?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  readonly phone?: string;

  @IsOptional()
  @IsString({ message: 'Avatar URL must be a string' })
  readonly avatarUrl?: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  readonly bio?: string;

  @IsOptional()
  @IsString({ message: 'Website URL must be a string' })
  readonly websiteUrl?: string;

  @IsOptional()
  readonly verified?: boolean;

  @IsOptional()
  @IsEnum(UserStatus, { message: 'User status must be either ADMIN or USER' })
  readonly role?: UserStatus;
}
