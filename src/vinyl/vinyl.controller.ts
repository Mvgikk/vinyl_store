import {
    Controller,
    Get,
    Param,
    Delete,
} from '@nestjs/common';
import { VinylService } from './vinyl.service';

@Controller('vinyl')
export class VinylController {
    constructor(private readonly vinylService: VinylService) {}


    @Get()
    findAll() {
        return this.vinylService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vinylService.findOne(+id);
    }


    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.vinylService.remove(+id);
    }
}
