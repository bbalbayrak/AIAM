import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getCurrentUserInfo(@Req() req: any, @Res() res: any) {
    const userId = req.user.userId;
    const currentUser = await this.userService.getCurrentUserInfo(userId);
    const { password, ...userWithoutPassword } = currentUser.get({
      plain: true,
    });
    return res.status(HttpStatus.OK).json({
      message: 'User information retrieved successfully',
      data: userWithoutPassword,
    });
  }
}
