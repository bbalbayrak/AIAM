import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REVIEW_REPOSITORY } from 'src/config/constants';
import { Review } from './review.entity';
import { ReviewDto } from './dto/review.dto';
import { UserService } from '../user/user.service';
import { ContractService } from '../contract/contract.service';
import { UpdateReviewDto } from './dto/updatedReview.dto';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(REVIEW_REPOSITORY) private readonly reviewRepository: typeof Review,
    private readonly userService: UserService,
    private readonly contractRepository: ContractService,
  ) {}

  async createReview(reviewDto: ReviewDto): Promise<Review> {
    const reviewer = await this.userService.getUserById(reviewDto.reviewer_id);
    const reviewee = await this.userService.getUserById(reviewDto.reviewee_id);
    const contract = await this.contractRepository.getContractById(
      reviewDto.contract_id,
    );
    if (!reviewer || !reviewee || !contract) {
      throw new NotFoundException('User or contract not found');
    }
    const newReview = await this.reviewRepository.create<Review>(reviewDto);

    return newReview;
  }

  async getReviews(): Promise<Review[]> {
    const allReviews = await this.reviewRepository.findAll();
    return allReviews;
  }

  async getReviewById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findByPk<Review>(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async updateReview(
    id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewRepository.findByPk<Review>(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    await review.update(updateReviewDto);
    return review;
  }

  async deleteReview(id: number): Promise<void> {
    const review = await this.reviewRepository.findByPk<Review>(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    await review.destroy();
  }
}
