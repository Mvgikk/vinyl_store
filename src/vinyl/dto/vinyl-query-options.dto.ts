import { IsOptional, IsString, IsIn } from 'class-validator';
import { PaginationOptionsDto } from '../../shared/dto/pagination-options.dto';

export class VinylQueryOptionsDto extends PaginationOptionsDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsIn(['price', 'name', 'author'])
    sort?: string = 'name';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    order: 'asc' | 'desc' = 'asc';

    getSortingOptions(): Record<string, 'ASC' | 'DESC'> {
        return { [this.sort]: this.order.toUpperCase() as 'ASC' | 'DESC' };
    }
}
