import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { RolesGuard } from 'src/decorators/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserStatus } from './userType';
import { UserDto } from './dto/user.dto';
import { Request, Response } from 'express';

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

  @Get(':id')
  async getUserById(@Param('id') id: number, @Res() res: any) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found',
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'User retrieved successfully',
      data: user,
    });
  }

  @Put(':id')
  async updateUserById(
    @Body() user: UserDto,
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!req.body) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No data provided for update',
      });
    }

    const updatedUser = await this.userService.updateUser(id, user);
    return res.status(HttpStatus.CREATED).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  }

  @Delete(':id')
  async deleteUserById(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user['userId'];
    const role = req.user['role'];

    if (role !== UserStatus.ADMIN && userId !== id) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'You are not authorized to delete this user',
      });
    }

    const userExists = await this.userService.getUserById(id);
    if (!userExists) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found',
      });
    }
    await this.userService.deleteUser(id);
    return res.status(HttpStatus.OK).json({
      message: 'User deleted successfully',
    });
  }
}
