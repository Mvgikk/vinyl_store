import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseReviewDto } from 'src/review/dto/response-review.dto';
import { VinylResponseDto } from 'src/vinyl/dto/vinyl-response.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserProfileResponseDto {
    @ApiProperty({ description: 'User email address' })
    @Expose()
    email: string;

    @ApiProperty({ description: 'User first name' })
    @Expose()
    firstName: string;

    @ApiProperty({ description: 'User last name' })
    @Expose()
    lastName: string;

    @ApiProperty({ description: 'User birthdate in YYYY-MM-DD format' })
    @Expose()
    birthdate: string;

    @ApiProperty({ description: 'URL of user avatar image', nullable: true })
    @Expose()
    avatarUrl: string | null;

    @ApiProperty({
        description: 'List of reviews made by the user',
        type: [ResponseReviewDto],
    })
    @Expose()
    @Type(() => ResponseReviewDto)
    reviews: ResponseReviewDto[];

    @ApiProperty({
        description: 'List of vinyl records purchased by the user',
        type: [VinylResponseDto],
    })
    @Expose()
    @Type(() => VinylResponseDto)
    purchasedVinyls: VinylResponseDto[];
}
