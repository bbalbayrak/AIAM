import { IsString } from 'class-validator';

export class AuthDto {
  @IsString({
    message: 'Email must be a string',
  })
  private readonly email: string;
  @IsString({
    message: 'Password must be a string',
  })
  private readonly password: string;
}
