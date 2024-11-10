import { IsInt, IsString, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty({
        description: 'Comment for the vinyl review',
        example: 'Amazing sound quality and packaging!',
    })
    @IsString()
    @IsNotEmpty()
    comment: string;

    @ApiProperty({
        description: 'Rating score for the vinyl (1 to 5)',
        example: 5,
        minimum: 1,
        maximum: 5,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({
        description: 'ID of the vinyl record being reviewed',
        example: 42,
    })
    @IsInt()
    vinylId: number;
}
