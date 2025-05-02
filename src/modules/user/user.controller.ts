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
import { RolesGuard } from 'src/decorators/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserStatus } from './userType';

@UseGuards(JwtAuthGuard, RolesGuard)
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

  //For admin use only
  @Get('all')
  @Roles(UserStatus.ADMIN)
  async getAllUsers(@Req() req: any, @Res() res: any) {
    const users = await this.userService.getAllUsers();
    return res.status(HttpStatus.OK).json({
      message: 'All users retrieved successfully',
      data: users,
    });
  }
}
