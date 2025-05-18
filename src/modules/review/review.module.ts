import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewProvider } from './review.provider';

@Module({
  providers: [ReviewService, ...ReviewProvider],
  controllers: [ReviewController],
})
export class ReviewModule {}
