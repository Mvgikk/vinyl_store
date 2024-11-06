import { Module } from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { VinylController } from './vinyl.controller';

@Module({
    controllers: [VinylController],
    providers: [VinylService],
})
export class VinylModule {}
