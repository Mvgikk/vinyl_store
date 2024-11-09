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
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/roles.enum';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { PaginationOptionsDto } from 'src/shared/dto/pagination-options.dto';
import { VinylQueryOptionsDto } from './dto/vinyl-query-options.dto';
import { ReviewService } from 'src/review/review.service';
import { ResponseReviewDto } from 'src/review/dto/response-review.dto';

@Controller('vinyl')
export class VinylController {
    constructor(
        private readonly vinylService: VinylService,
        private readonly reviewService: ReviewService
    ) {}

    @Get()
    async findAll(
        @Query() paginationOptions: PaginationOptionsDto
    ): Promise<{ data: Vinyl[]; total: number; page: number; limit: number }> {
        return this.vinylService.findAllWithPagination(paginationOptions);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async create(@Body() createVinylDto: CreateVinylDto) {
        return await this.vinylService.createVinyl(createVinylDto);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async update(
        @Param('id') id: number,
        @Body() updateVinylDto: UpdateVinylDto
    ) {
        return await this.vinylService.updateVinyl(id, updateVinylDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    async remove(@Param('id') id: number) {
        await this.vinylService.deleteVinyl(id);
        return { message: 'Vinyl record deleted successfully' };
    }

    @Get('search')
    async searchVinyls(
        @Query() queryOptions: VinylQueryOptionsDto
    ): Promise<{ data: Vinyl[]; total: number; page: number; limit: number }> {
        return await this.vinylService.searchVinyls(queryOptions);
    }

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
