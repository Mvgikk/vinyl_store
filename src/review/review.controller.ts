import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    findAll() {
        return this.reviewService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reviewService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reviewService.remove(+id);
    }
}
