import { IsInt, IsString, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsInt()
    vinylId: number;
}
