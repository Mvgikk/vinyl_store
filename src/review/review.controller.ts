import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Delete,
    Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/roles.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async addReview(@Body() createReviewDto: CreateReviewDto, @Req() req) {
        const userId = req.user.userId;
        return await this.reviewService.addReview(createReviewDto, userId);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async deleteReview(@Param('id') reviewId: number) {
        await this.reviewService.deleteReview(reviewId);
        return { message: 'Review deleted successfully' };
    }
}
