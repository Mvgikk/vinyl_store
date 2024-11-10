import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVinylDto {
    @ApiProperty({
        description: 'Author of the vinyl record',
        example: 'The Beatles',
        required: false,
    })
    @IsString()
    @IsOptional()
    author?: string;

    @ApiProperty({
        description: 'Name of the vinyl record',
        example: 'Abbey Road',
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Description of the vinyl record',
        example: 'A classic Beatles album released in 1969',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'URL of the vinyl cover image',
        example: 'https://example.com/abbey-road.jpg',
        required: false,
    })
    @IsUrl()
    @IsOptional()
    image?: string;

    @ApiProperty({
        description: 'Price of the vinyl record',
        example: 29.99,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    price?: number;
}
