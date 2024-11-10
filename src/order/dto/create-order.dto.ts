import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({
        description: 'List of items to be ordered',
        type: [OrderItemDto],
        example: [
            { vinylId: 1, quantity: 2 },
            { vinylId: 2, quantity: 1 },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
