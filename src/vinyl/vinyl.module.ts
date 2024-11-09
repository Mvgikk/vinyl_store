import { Module } from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { VinylController } from './vinyl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vinyl } from './entities/vinyl.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Vinyl])],
    controllers: [VinylController],
    providers: [VinylService],
})
export class VinylModule {}
