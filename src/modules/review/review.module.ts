import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewProvider } from './review.provider';
import { UserModule } from '../user/user.module';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [UserModule, ContractModule],
  providers: [ReviewService, ...ReviewProvider],
  controllers: [ReviewController],
})
export class ReviewModule {}
