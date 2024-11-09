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
}
