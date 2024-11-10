import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('order')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @ApiOperation({
        summary: 'Create a new order and start the payment process',
    })
    @ApiBody({ type: CreateOrderDto })
    @ApiResponse({
        status: 201,
        description: 'The URL for the Stripe checkout session',
        schema: {
            example: { sessionUrl: 'https://checkout.stripe.com/pay/...' },
        },
    })
    @Post('create')
    async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
        const userId = req.user.userId;
        const sessionUrl = await this.orderService.createOrder(
            userId,
            createOrderDto.items
        );
        return { sessionUrl };
    }

    @ApiOperation({ summary: 'Complete an order after successful payment' })
    @ApiQuery({
        name: 'session_id',
        required: true,
        description:
            'The session ID provided by Stripe upon successful payment',
    })
    @ApiResponse({
        status: 200,
        description: 'Order completion confirmation',
        schema: {
            example: {
                message: 'Payment successful and order completed',
                orderId: 1,
            },
        },
    })
    @Get('complete')
    async completeOrder(@Query('session_id') sessionId: string) {
        return await this.orderService.completeOrder(sessionId);
    }

    @ApiOperation({ summary: 'Cancel an existing order' })
    @ApiQuery({
        name: 'orderId',
        required: true,
        description: 'The ID of the order to be canceled',
    })
    @ApiResponse({
        status: 200,
        description: 'Order cancellation confirmation',
        schema: {
            example: {
                message: 'Order with ID 1 has been successfully canceled.',
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @Get('cancel')
    async cancelOrder(@Query('orderId') orderId: number) {
        return await this.orderService.cancelOrder(orderId);
    }
}
