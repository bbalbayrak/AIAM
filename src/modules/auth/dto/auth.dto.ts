import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsString({
    message: 'Email must be a string',
  })
  @IsNotEmpty({
    message: 'Email is required',
  })
  private readonly email: string;
  @IsString({
    message: 'Password must be a string',
  })
  @IsNotEmpty({
    message: 'Email is required',
  })
  private readonly password: string;
}
