import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Review } from './entities/review.entity';
import { ResponseReviewDto } from './dto/response-review.dto';

@Injectable()
export class ReviewHelperService {
    calculateAverageScore(reviews: Review[]): number | null {
        if (reviews.length === 0) {
            return null;
        }

        const totalScore = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );
        return totalScore / reviews.length;
    }
    getFirstReviewFromAnotherUser(reviews: Review[]): ResponseReviewDto | null {
        if (reviews.length === 0) {
            return null;
        }

        const firstReview = reviews[0];
        return plainToInstance(ResponseReviewDto, firstReview, {
            excludeExtraneousValues: true,
        });
    }
}
