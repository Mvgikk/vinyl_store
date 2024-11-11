import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { VinylQueryOptionsDto } from './dto/vinyl-query-options.dto';
import { PaginationOptionsDto } from '../shared/dto/pagination-options.dto';
import { plainToInstance } from 'class-transformer';
import { ExtendedVinylResponseDto } from './dto/extended-vinyl-response.dto';
import { ReviewHelperService } from '../review/review-helper.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Injectable()
export class VinylService {
    constructor(
        @InjectRepository(Vinyl)
        private readonly vinylRepository: Repository<Vinyl>,
        private readonly reviewHelperService: ReviewHelperService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    async findAll(): Promise<Vinyl[]> {
        return await this.vinylRepository.find({
            select: ['id', 'name', 'author', 'description', 'price'],
        });
    }

    async findAllWithPagination(
        paginationOptions: PaginationOptionsDto
    ): Promise<{ data: Vinyl[]; total: number; page: number; limit: number }> {
        const { page, limit } = paginationOptions;

        const [data, total] = await this.vinylRepository.findAndCount({
            select: ['id', 'name', 'author', 'description', 'price'],
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            limit,
        };
    }

    async findAllWithPaginationAndFirstReview(
        paginationOptions: PaginationOptionsDto
    ): Promise<{
        data: ExtendedVinylResponseDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        const { page, limit } = paginationOptions;

        const [vinyls, total] = await this.vinylRepository.findAndCount({
            relations: ['reviews', 'reviews.user'],
            skip: (page - 1) * limit,
            take: limit,
        });

        const data = vinyls.map((vinyl) => {
            const reviews = vinyl.reviews;

            const averageScore =
                this.reviewHelperService.calculateAverageScore(reviews);

            const firstReviewFromAnotherUser =
                this.reviewHelperService.getFirstReviewFromAnotherUser(reviews);

            return plainToInstance(
                ExtendedVinylResponseDto,
                {
                    ...vinyl,
                    averageScore,
                    firstReviewFromAnotherUser,
                },
                { excludeExtraneousValues: true }
            );
        });

        return {
            data,
            total,
            page,
            limit,
        };
    }

    async createVinyl(createVinylDto: CreateVinylDto): Promise<Vinyl> {
        const vinyl = this.vinylRepository.create(createVinylDto);
        const savedVinyl = await this.vinylRepository.save(vinyl);
        this.logger.info(`Created vinyl with ID: ${savedVinyl.id}`, {
            action: 'create',
            id: savedVinyl.id,
        });
        return savedVinyl;
    }

    async findOneById(id: number): Promise<Vinyl | null> {
        const vinyl = await this.vinylRepository.findOne({ where: { id } });
        if (!vinyl) {
            return null;
        }
        this.logger.info(`Fetched vinyl with ID: ${id}`, {
            action: 'find',
            id,
        });
        return vinyl;
    }

    async updateVinyl(
        id: number,
        updateVinylDto: UpdateVinylDto
    ): Promise<Vinyl> {
        const vinyl = await this.findOneById(id);
        if (!vinyl) {
            throw new NotFoundException(`Vinyl record with ID ${id} not found`);
        }
        Object.assign(vinyl, updateVinylDto);
        const updatedVinyl = await this.vinylRepository.save(vinyl);
        this.logger.info(`Updated vinyl with ID: ${updatedVinyl.id}`, {
            action: 'update',
            id: updatedVinyl.id,
        });
        return updatedVinyl;
    }

    async deleteVinyl(id: number): Promise<void> {
        const vinyl = await this.findOneById(id);
        if (!vinyl) {
            throw new NotFoundException(`Vinyl record with ID ${id} not found`);
        }
        await this.vinylRepository.remove(vinyl);
        this.logger.info(`Deleted vinyl with ID: ${id}`, {
            action: 'delete',
            id,
        });
    }

    async searchVinyls(
        queryOptions: VinylQueryOptionsDto
    ): Promise<{ data: Vinyl[]; total: number; page: number; limit: number }> {
        const { name, author, page, limit, sort, order } = queryOptions;
        const where: FindOptionsWhere<Vinyl> = {};

        if (name) where.name = Like(`%${name}%`);
        if (author) where.author = Like(`%${author}%`);

        const orderOptions = {
            [sort || 'name']: (order || 'asc').toUpperCase(),
        };

        const [data, total] = await this.vinylRepository.findAndCount({
            where,
            order: orderOptions,
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            limit,
        };
    }
}
