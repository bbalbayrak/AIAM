import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { BusinessProvider } from './business.provider';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [BusinessService, ...BusinessProvider],
  controllers: [BusinessController],
})
export class BusinessModule {}
