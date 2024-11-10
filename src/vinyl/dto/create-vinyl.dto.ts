import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsUrl,
    IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVinylDto {
    @ApiProperty({
        description: 'Author of the vinyl record',
        example: 'The Beatles',
    })
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiProperty({
        description: 'Name of the vinyl record',
        example: 'Abbey Road',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Description of the vinyl record',
        example: 'A classic Beatles album released in 1969',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

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
    })
    @IsNumber()
    @IsNotEmpty()
    price: number;
}
