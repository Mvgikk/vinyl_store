import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsUrl,
    IsOptional,
} from 'class-validator';

export class CreateVinylDto {
    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsUrl()
    @IsOptional()
    image?: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}
