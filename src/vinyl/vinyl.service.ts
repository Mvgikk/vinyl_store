import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';

@Injectable()
export class VinylService {
    constructor(
        @InjectRepository(Vinyl)
        private readonly vinylRepository: Repository<Vinyl>
    ) {}

    async findAll(
        page: number = 1,
        limit: number = 10
    ): Promise<{ data: Vinyl[]; total: number; page: number; limit: number }> {
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
}
