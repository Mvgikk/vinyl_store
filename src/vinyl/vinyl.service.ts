import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';

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

    async createVinyl(createVinylDto: CreateVinylDto): Promise<Vinyl> {
        const vinyl = this.vinylRepository.create(createVinylDto);
        return await this.vinylRepository.save(vinyl);
    }

    async findOneById(id: number): Promise<Vinyl> {
        const vinyl = await this.vinylRepository.findOne({ where: { id } });
        if (!vinyl) {
            throw new NotFoundException(`Vinyl record with ID ${id} not found`);
        }
        return vinyl;
    }

    async updateVinyl(
        id: number,
        updateVinylDto: UpdateVinylDto
    ): Promise<Vinyl> {
        const vinyl = await this.findOneById(id);
        Object.assign(vinyl, updateVinylDto);
        return await this.vinylRepository.save(vinyl);
    }

    async deleteVinyl(id: number): Promise<void> {
        const vinyl = await this.findOneById(id);
        await this.vinylRepository.remove(vinyl);
    }
}
