import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';

@Module({
    imports: [],
    providers: [HashingService],
    exports: [HashingService],
})
export class SharedModule {}
