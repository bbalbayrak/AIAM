import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async Login(@Body() user: AuthDto) {
    return await this.authService.login(user);
  }
  // @Post('register')
  // @HttpCode(HttpStatus.CREATED)
  // async Register(@Body() user: ) {
  //   return await this.authService.register(user);
  // }
}
