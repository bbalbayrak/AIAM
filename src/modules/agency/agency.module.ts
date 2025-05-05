import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { AgencyProvider } from './agency.provider';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AgencyService, ...AgencyProvider],
  controllers: [AgencyController],
})
export class AgencyModule {}
