import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './jwt.constants';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { sub: number; name: string; role: string }) {
    const user = await this.userService.getUserById(payload.sub);
    if (!user || !user.verified) {
      this.throwUnauthorized();
    }

    return { userId: user.id, email: user.email, role: user.role };
  }
  private throwUnauthorized() {
    throw new UnauthorizedException(
      'Unauthorized: User not found or token invalid.',
    );
  }
}
