import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './passport/jwt.constants';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

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

  async login(user: User) {
    const payload = { sub: user.user_id, name: user.name, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.expirationTime,
      secret: jwtConstants.secret,
    });
    return { message: 'Login successful', access_token: access_token };
  }
}
