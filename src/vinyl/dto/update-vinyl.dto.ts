import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class UpdateVinylDto {
    @IsString()
    @IsOptional()
    author?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl()
    @IsOptional()
    image?: string;

    @IsNumber()
    @IsOptional()
    price?: number;
}
