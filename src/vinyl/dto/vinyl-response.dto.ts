import { Expose } from 'class-transformer';

export class VinylResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    author: string;

    @Expose()
    description: string;

    @Expose()
    price: number;
}
