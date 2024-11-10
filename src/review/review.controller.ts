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
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@ApiBearerAuth()
@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @ApiOperation({ summary: 'Add a new review for a vinyl record' })
    @ApiResponse({ status: 201, description: 'The review has been created.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async addReview(@Body() createReviewDto: CreateReviewDto, @Req() req) {
        const userId = req.user.userId;
        return await this.reviewService.addReview(createReviewDto, userId);
    }

    @ApiOperation({ summary: 'Delete a review (Admin only)' })
    @ApiParam({
        name: 'id',
        type: 'number',
        description: 'ID of the review to delete',
    })
    @ApiResponse({ status: 200, description: 'Review deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({
        status: 403,
        description: 'Forbidden. Only admins can delete reviews.',
    })
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async deleteReview(@Param('id') reviewId: number) {
        await this.reviewService.deleteReview(reviewId);
        return { message: 'Review deleted successfully' };
    }
}
