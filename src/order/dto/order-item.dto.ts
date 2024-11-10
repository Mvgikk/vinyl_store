import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
    @ApiProperty({
        description: 'The ID of the vinyl record being ordered',
        example: 1,
    })
    @IsInt()
    vinylId: number;

    @ApiProperty({
        description: 'The quantity of the vinyl record being ordered',
        example: 2,
    })
    @IsInt()
    quantity: number;
}
