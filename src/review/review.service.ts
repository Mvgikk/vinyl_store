import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { VinylService } from '../vinyl/vinyl.service';
import { UserService } from 'src/user/user.service';
import { ResponseReviewDto } from './dto/response-review.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationOptionsDto } from 'src/shared/dto/pagination-options.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        private readonly vinylService: VinylService,
        private readonly userService: UserService
    ) {}

    async addReview(
        createReviewDto: CreateReviewDto,
        userId: number
    ): Promise<ResponseReviewDto> {
        const vinyl = await this.vinylService.findOneById(
            createReviewDto.vinylId
        );
        const user = await this.userService.findOneById(userId);

        const review = this.reviewRepository.create({
            ...createReviewDto,
            user,
            vinyl,
        });
        const savedReview = await this.reviewRepository.save(review);

        return plainToInstance(ResponseReviewDto, savedReview, {
            excludeExtraneousValues: true,
        });
    }
    async findOneById(id: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({ where: { id } });
        if (!review) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }
        return review;
    }

    async deleteReview(reviewId: number): Promise<void> {
        const review = await this.findOneById(reviewId);
        await this.reviewRepository.remove(review);
    }

    async getReviewsForVinyl(
        vinylId: number,
        paginationOptions: PaginationOptionsDto
    ): Promise<{
        data: ResponseReviewDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        const { page, limit } = paginationOptions;

        const [reviews, total] = await this.reviewRepository.findAndCount({
            where: { vinyl: { id: vinylId } },
            skip: (page - 1) * limit,
            take: limit,
        });

        const data = plainToInstance(ResponseReviewDto, reviews, {
            excludeExtraneousValues: true,
        });
        return { data, total, page, limit };
    }
}
