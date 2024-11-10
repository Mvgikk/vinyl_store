import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { StripeService } from './stripe.service';
import { VinylService } from 'src/vinyl/vinyl.service';
import { UserService } from 'src/user/user.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        private readonly vinylService: VinylService,
        private readonly stripeService: StripeService,
        private readonly userService: UserService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private eventEmitter: EventEmitter2
    ) {}

    async findOrderBySessionId(sessionId: string): Promise<Order> {
        this.logger.info(`Fetching order for session ID: ${sessionId}`, {
            action: 'findOrderBySessionId',
            sessionId,
        });

        const order = await this.orderRepository.findOne({
            where: { stripeSessionId: sessionId },
            relations: ['orderItems', 'user'],
        });

        if (!order) {
            throw new NotFoundException(
                `Order not found for session ID ${sessionId}`
            );
        }

        return order;
    }

    async findOrderById(orderId: number): Promise<Order> {
        this.logger.info(`Fetching order with ID: ${orderId}`, {
            action: 'findOrderById',
            orderId,
        });

        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['user'],
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }

        return order;
    }

    async createOrder(
        userId: number,
        items: { vinylId: number; quantity: number }[]
    ) {
        this.logger.info(`Creating order for user ID: ${userId}`, {
            action: 'createOrder',
            userId,
            items,
        });

        const orderItems = await this.createOrderItems(items);
        const totalPrice = orderItems.reduce(
            (sum, item) => sum + item.quantity * item.vinyl.price,
            0
        );
        const user = await this.userService.findOneById(userId);

        const order = this.orderRepository.create({
            user,
            totalPrice,
            status: 'pending',
            orderItems,
        });
        await this.orderRepository.save(order);

        const stripeSession = await this.createStripeSession(
            orderItems,
            order.id
        );
        order.stripeSessionId = stripeSession.id;
        await this.orderRepository.save(order);

        this.logger.info(
            `Order created with ID: ${order.id} and session ID: ${stripeSession.id}`,
            {
                action: 'createOrder',
                orderId: order.id,
                stripeSessionId: stripeSession.id,
            }
        );

        this.eventEmitter.emit('notification', {
            type: 'paymentInitiated',
            payload: {
                email: user.email,
                orderId: order.id,
                amount: totalPrice,
            },
        });

        return { url: stripeSession.url };
    }

    async completeOrder(
        sessionId: string
    ): Promise<{ message: string; orderId?: number }> {
        this.logger.info(`Completing order for session ID: ${sessionId}`, {
            action: 'completeOrder',
            sessionId,
        });

        const session = await this.stripeService.retrieveSession(sessionId);

        if (session.payment_status === 'paid') {
            const order = await this.findOrderBySessionId(sessionId);

            order.status = 'completed';
            await this.orderRepository.save(order);
            this.logger.info(
                `Order with ID ${order.id} has been completed successfully`,
                { action: 'completeOrder', orderId: order.id }
            );

            this.eventEmitter.emit('notification', {
                type: 'paymentCompleted',
                payload: {
                    email: order.user.email,
                    orderId: order.id,
                    price: order.totalPrice,
                },
            });

            return {
                message: 'Payment successful and order completed',
                orderId: order.id,
            };
        } else {
            throw new Error('Payment not successful');
        }
    }

    async cancelOrder(orderId: number): Promise<{ message: string }> {
        const order = await this.findOrderById(orderId);

        order.status = 'canceled';
        await this.orderRepository.save(order);

        this.logger.info(`Order with ID ${orderId} has been canceled`, {
            action: 'cancelOrder',
            orderId,
        });

        this.eventEmitter.emit('notification', {
            type: 'orderCanceled',
            payload: {
                email: order.user.email,
                orderId: order.id,
            },
        });

        return {
            message: `Order with ID ${orderId} has been successfully canceled.`,
        };
    }

    private async createOrderItems(
        items: { vinylId: number; quantity: number }[]
    ): Promise<OrderItem[]> {
        return Promise.all(
            items.map(async (item) => {
                const vinyl = await this.vinylService.findOneById(item.vinylId);

                const orderItem = new OrderItem();
                orderItem.vinyl = vinyl;
                orderItem.quantity = item.quantity;
                return orderItem;
            })
        );
    }

    private async createStripeSession(
        orderItems: OrderItem[],
        orderId: number
    ) {
        return this.stripeService.createCheckoutSession(
            orderItems.map((item) => ({
                name: item.vinyl.name,
                description: item.vinyl.description,
                price: item.vinyl.price,
                quantity: item.quantity,
            })),
            orderId
        );
    }
}
