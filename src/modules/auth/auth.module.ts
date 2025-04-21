import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtExpiredFilter } from './passport/jwtExpire.filter';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWTSECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRESIN },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: JwtExpiredFilter,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
