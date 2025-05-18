import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto/review.dto';
import { Response } from 'express';
import { UpdateReviewDto } from './dto/updatedReview.dto';

@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('')
  async createReview(@Body() reviewDto: ReviewDto, @Res() res: Response) {
    const newReview = await this.reviewService.createReview(reviewDto);
    if (!newReview) {
      throw new BadRequestException('Review not created');
    }

    return res.status(HttpStatus.CREATED).json({
      message: 'Review created successfully',
      data: newReview,
    });
  }

  @Get('')
  async getReviews(@Res() res: Response) {
    const reviews = await this.reviewService.getReviews();
    if (!reviews || reviews.length === 0) {
      throw new NotFoundException('No reviews found');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Reviews retrieved successfully',
      data: reviews,
    });
  }

  @Get(':id')
  async getReviewById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const review = await this.reviewService.getReviewById(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Review retrieved successfully',
      data: review,
    });
  }

  @Patch(':id')
  async updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Res() res: Response,
  ) {
    const updatedReview = await this.reviewService.updateReview(
      id,
      updateReviewDto,
    );
    if (!updatedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Review updated successfully',
      data: updatedReview,
    });
  }

  @Delete(':id')
  async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const review = await this.reviewService.getReviewById(id);
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }
      await this.reviewService.deleteReview(id);
      return res.status(HttpStatus.OK).json({
        message: 'Review deleted successfully',
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
