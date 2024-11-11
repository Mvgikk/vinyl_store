import { IsOptional, IsString, IsIn } from 'class-validator';
import { PaginationOptionsDto } from '../../shared/dto/pagination-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class VinylQueryOptionsDto extends PaginationOptionsDto {
    @ApiPropertyOptional({
        description: 'Filter vinyl records by name',
        example: 'Abbey Road',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Filter vinyl records by author',
        example: 'The Beatles',
    })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiPropertyOptional({
        description: 'Sort vinyl records by field',
        example: 'price',
        enum: ['price', 'name', 'author'],
        default: 'name',
    })
    @IsOptional()
    @IsIn(['price', 'name', 'author'])
    sort?: string = 'name';

    @ApiPropertyOptional({
        description: 'Order of sorting',
        example: 'asc',
        enum: ['asc', 'desc'],
        default: 'asc',
    })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    order: 'asc' | 'desc' = 'asc';
}
