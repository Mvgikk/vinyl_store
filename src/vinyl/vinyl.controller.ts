import { Controller, Get, Query } from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { Vinyl } from './entities/vinyl.entity';

@Controller('vinyl')
export class VinylController {
    constructor(private readonly vinylService: VinylService) {}

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<{ data: Vinyl[]; total: number; page: number; limit: number }> {
        limit = Math.min(limit, 100);
        return this.vinylService.findAll(page, limit);
    }
}
