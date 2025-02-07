import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { VinylService } from '../vinyl/vinyl.service';
import { UserService } from '../user/user.service';
import { ResponseReviewDto } from './dto/response-review.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationOptionsDto } from '../shared/dto/pagination-options.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        private readonly vinylService: VinylService,
        private readonly userService: UserService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    async addReview(
        createReviewDto: CreateReviewDto,
        userId: number
    ): Promise<ResponseReviewDto> {
        const vinyl = await this.vinylService.findOneById(
            createReviewDto.vinylId
        );
        if (!vinyl) {
            throw new NotFoundException(
                `Vinyl with ID ${createReviewDto.vinylId} not found`
            );
        }

        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const review = this.reviewRepository.create({
            ...createReviewDto,
            user,
            vinyl,
        });
        const savedReview = await this.reviewRepository.save(review);
        this.logger.info(
            `Added review with ID: ${savedReview.id} for Vinyl ID: ${createReviewDto.vinylId}`,
            {
                action: 'addReview',
                reviewId: savedReview.id,
                vinylId: createReviewDto.vinylId,
                userId: userId,
            }
        );
        return plainToInstance(ResponseReviewDto, savedReview, {
            excludeExtraneousValues: true,
        });
    }
    async findOneById(id: number): Promise<Review | null> {
        const review = await this.reviewRepository.findOne({ where: { id } });
        if (!review) {
            return null;
        }
        this.logger.info(`Fetched review with ID: ${id}`, {
            action: 'findOneById',
            reviewId: id,
        });
        return review;
    }

    async deleteReview(reviewId: number): Promise<void> {
        const review = await this.findOneById(reviewId);
        if (!review) {
            throw new NotFoundException(`Review with ID ${reviewId} not found`);
        }
        await this.reviewRepository.remove(review);
        this.logger.info(`Deleted review with ID: ${reviewId}`, {
            action: 'deleteReview',
            reviewId,
        });
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
        const vinyl = await this.vinylService.findOneById(vinylId);
        if (!vinyl) {
            throw new NotFoundException(`Vinyl with ID ${vinylId} not found`);
        }
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
