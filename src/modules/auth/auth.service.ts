import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './passport/jwt.constants';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      return null;
    }
  }

  async register(user: UserDto) {
    const existingUser = await this.userService.findByEmail(user.email);
    if (existingUser) {
      throw new ForbiddenException('User already exists !');
    }
    const newUser = await this.userService.createUser(user);
    return newUser;
  }

  async login(authDto: AuthDto) {
    const user = await this.userService.findByEmail(authDto.email);
    if (!user) {
      return { message: 'User not found' };
    }
    const passwdMatch = await bcrypt.compare(
      authDto.password.trim(),
      user.password.trim(),
    );

    if (!passwdMatch) {
      throw new ForbiddenException('Incorrect Password !');
    }
    const access_token = await this.signToken(user.id, user.email, user.role);
    return { message: 'Login successful', access_token: access_token };
  }

  signToken(userId: number, email: string, role: string) {
    const payload = { userId: userId, email: email, role: role };
    return this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.expirationTime,
      secret: jwtConstants.secret,
    });
  }
}
