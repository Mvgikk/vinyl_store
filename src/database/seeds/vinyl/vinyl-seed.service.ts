import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vinyl } from '../../../vinyl/entities/vinyl.entity';

@Injectable()
export class VinylSeedService {
    constructor(
        @InjectRepository(Vinyl)
        private readonly vinylRepository: Repository<Vinyl>
    ) {}

    async run() {
        const vinyl = this.vinylRepository.create({
            name: 'Abbey Road',
            author: 'The Beatles',
            description: 'Classic Beatles album',
            price: 29.99,
        });
        await this.vinylRepository.save(vinyl);
        console.log('Vinyl data seeded successfully!');
    }
}
