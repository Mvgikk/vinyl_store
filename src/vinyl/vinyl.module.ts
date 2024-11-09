import { forwardRef, Module } from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { VinylController } from './vinyl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { ReviewModule } from 'src/review/review.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Vinyl]),
        forwardRef(() => ReviewModule),
    ],
    controllers: [VinylController],
    providers: [VinylService],
    exports: [VinylService],
})
export class VinylModule {}
