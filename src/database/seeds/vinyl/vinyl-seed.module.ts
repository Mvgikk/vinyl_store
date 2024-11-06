import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinylSeedService } from './vinyl-seed.service';
import { Vinyl } from '../../../vinyl/entities/vinyl.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vinyl])],
    providers: [VinylSeedService],
    exports: [VinylSeedService],
})
export class VinylSeedModule {}
