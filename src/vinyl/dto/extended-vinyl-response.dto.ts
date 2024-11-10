import { Expose, Type } from 'class-transformer';
import { ResponseReviewDto } from '../../review/dto/response-review.dto';

export class ExtendedVinylResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    author: string;

    @Expose()
    description: string;

    @Expose()
    price: number;

    @Expose()
    averageScore: number;

    @Expose()
    @Type(() => ResponseReviewDto)
    firstReviewFromAnotherUser: ResponseReviewDto;
}
