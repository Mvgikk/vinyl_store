import { test } from 'node:test';
import assert from 'assert';
import { OrderService } from './order.service';
import { NotFoundException } from '@nestjs/common';

const mockOrderRepository = {
    create: (orderData: any) => orderData,
    save: async (order: any) => ({ ...order, id: 1 }),
    findOne: async ({ where: { id, stripeSessionId } }: any) => {
        if (id === 1 || stripeSessionId === 'valid_session')
            return { id: 1, user: { email: 'test@example.com' } };
        return null;
    },
};

const mockOrderItemRepository = {};
const mockVinylService = {
    findOneById: async (id: number) =>
        id === 1 ? { id, name: 'Sample Vinyl', price: 20 } : null,
};
const mockStripeService = {
    createCheckoutSession: async () => ({
        id: 'session_id',
        url: 'https://stripe.url',
    }),
    retrieveSession: async (sessionId: string) => ({
        payment_status: sessionId === 'valid_session' ? 'paid' : 'unpaid',
    }),
};
const mockUserService = {
    findOneById: async (userId: number) =>
        userId === 1 ? { id: userId, email: 'user@example.com' } : null,
};
const mockEventEmitter = { emit: () => {} };
const mockLogger = { info: () => {} };

const orderService = new OrderService(
    mockOrderRepository as any,
    mockOrderItemRepository as any,
    mockVinylService as any,
    mockStripeService as any,
    mockUserService as any,
    mockLogger as any,
    mockEventEmitter as any
);

test('OrderService.findOrderBySessionId should return order if found', async () => {
    const order = await orderService.findOrderBySessionId('valid_session');
    assert.strictEqual(order?.id, 1);
});

test('OrderService.findOrderBySessionId should return null if order not found', async () => {
    const order = await orderService.findOrderBySessionId('invalid_session');
    assert.strictEqual(order, null);
});

test('OrderService.createOrder should throw NotFoundException if user not found', async () => {
    try {
        await orderService.createOrder(2, [{ vinylId: 1, quantity: 1 }]);
    } catch (error) {
        assert(error instanceof NotFoundException);
        assert.strictEqual(error.message, 'User with ID 2 not found');
    }
});

test('OrderService.createOrder should create order and return URL', async () => {
    const result = await orderService.createOrder(1, [
        { vinylId: 1, quantity: 1 },
    ]);
    assert.strictEqual(result.url, 'https://stripe.url');
});

test('OrderService.completeOrder should mark order as completed if payment is successful', async () => {
    const result = await orderService.completeOrder('valid_session');
    assert.strictEqual(
        result.message,
        'Payment successful and order completed'
    );
    assert.strictEqual(result.orderId, 1);
});

test('OrderService.completeOrder should throw error if payment not successful', async () => {
    try {
        await orderService.completeOrder('invalid_session');
    } catch (error) {
        assert.strictEqual(error.message, 'Payment not successful');
    }
});

test('OrderService.cancelOrder should throw NotFoundException if order not found', async () => {
    try {
        await orderService.cancelOrder(2);
    } catch (error) {
        assert(error instanceof NotFoundException);
        assert.strictEqual(error.message, 'Order with ID 2 not found');
    }
});

test('OrderService.cancelOrder should cancel order if found', async () => {
    const result = await orderService.cancelOrder(1);
    assert.strictEqual(
        result.message,
        'Order with ID 1 has been successfully canceled.'
    );
});
