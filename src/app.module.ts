import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import { AgencyModule } from './modules/agency/agency.module';
import { BusinessModule } from './modules/business/business.module';
import { ProjectModule } from './modules/project/project.module';
import { ProposalModule } from './modules/proposal/proposal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    UserModule,
    AgencyModule,
    BusinessModule,
    ProjectModule,
    ProposalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
