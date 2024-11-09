import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { VinylResponseDto } from '../../vinyl/dto/vinyl-response.dto';

export class ResponseReviewDto {
    @Expose()
    id: number;

    @Expose()
    comment: string;

    @Expose()
    rating: number;

    @Expose()
    createdAt: Date;

    @Expose()
    @Type(() => UserResponseDto)
    user: UserResponseDto;

    @Expose()
    @Type(() => VinylResponseDto)
    vinyl: VinylResponseDto;
}
