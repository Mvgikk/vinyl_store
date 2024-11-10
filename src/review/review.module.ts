import { forwardRef, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { VinylModule } from 'src/vinyl/vinyl.module';
import { UserModule } from 'src/user/user.module';
import { ReviewHelperService } from './review-helper.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Review]),
        forwardRef(() => VinylModule),
        UserModule,
    ],
    controllers: [ReviewController],
    providers: [ReviewService, ReviewHelperService],
    exports: [ReviewService, ReviewHelperService],
})
export class ReviewModule {}
