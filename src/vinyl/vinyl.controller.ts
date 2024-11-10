import {
    Controller,
    Get,
    Query,
    Body,
    Post,
    UseGuards,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { Vinyl } from './entities/vinyl.entity';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../shared/enums/roles.enum';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { PaginationOptionsDto } from '../shared/dto/pagination-options.dto';
import { VinylQueryOptionsDto } from './dto/vinyl-query-options.dto';
import { ReviewService } from '../review/review.service';
import { ResponseReviewDto } from '../review/dto/response-review.dto';
import { ExtendedVinylResponseDto } from './dto/extended-vinyl-response.dto';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiQuery,
} from '@nestjs/swagger';

@Controller('vinyl')
@ApiTags('Vinyls')
export class VinylController {
    constructor(
        private readonly vinylService: VinylService,
        private readonly reviewService: ReviewService
    ) {}

    @ApiOperation({
        summary: 'Get a paginated list of vinyl records with reviews',
    })
    @ApiResponse({
        status: 200,
        description: 'List of vinyl records retrieved successfully',
        type: ExtendedVinylResponseDto,
        isArray: true,
    })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Get()
    async findAll(@Query() paginationOptions: PaginationOptionsDto): Promise<{
        data: ExtendedVinylResponseDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        return this.vinylService.findAllWithPaginationAndFirstReview(
            paginationOptions
        );
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new vinyl record (Admin only)' })
    @ApiResponse({
        status: 201,
        description: 'Vinyl record created successfully',
        type: Vinyl,
    })
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async create(@Body() createVinylDto: CreateVinylDto) {
        return await this.vinylService.createVinyl(createVinylDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a vinyl record by ID (Admin only)' })
    @ApiResponse({
        status: 200,
        description: 'Vinyl record updated successfully',
        type: Vinyl,
    })
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async update(
        @Param('id') id: number,
        @Body() updateVinylDto: UpdateVinylDto
    ) {
        return await this.vinylService.updateVinyl(id, updateVinylDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a vinyl record by ID (Admin only)' })
    @ApiResponse({
        status: 200,
        description: 'Vinyl record deleted successfully',
    })
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async remove(@Param('id') id: number) {
        await this.vinylService.deleteVinyl(id);
        return { message: 'Vinyl record deleted successfully' };
    }

    @ApiOperation({ summary: 'Search vinyl records with filters and sorting' })
    @ApiResponse({
        status: 200,
        description: 'Filtered vinyl records retrieved successfully',
        type: Vinyl,
        isArray: true,
    })
    @Get('search')
    async searchVinyls(
        @Query() queryOptions: VinylQueryOptionsDto
    ): Promise<{ data: Vinyl[]; total: number; page: number; limit: number }> {
        return await this.vinylService.searchVinyls(queryOptions);
    }

    @ApiOperation({
        summary: 'Get paginated reviews for a specific vinyl record',
    })
    @ApiResponse({
        status: 200,
        description: 'Reviews for vinyl record retrieved successfully',
        type: ResponseReviewDto,
        isArray: true,
    })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Get(':vinylId/reviews')
    async getReviewsForVinyl(
        @Param('vinylId') vinylId: number,
        @Query() paginationOptions: PaginationOptionsDto
    ): Promise<{
        data: ResponseReviewDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        return this.reviewService.getReviewsForVinyl(
            vinylId,
            paginationOptions
        );
    }
}
