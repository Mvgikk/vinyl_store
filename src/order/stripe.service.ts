import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;
    private appUrl: string;

    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(this.configService.get('stripe.secretKey'), {
            apiVersion: '2024-10-28.acacia',
        });
        this.appUrl = this.configService.get<string>('appUrl');
    }

    async createCheckoutSession(
        items: {
            name: string;
            description: string;
            price: number;
            quantity: number;
        }[],
        orderId: number
    ) {
        return this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: item.description,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${this.appUrl}/order/complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.appUrl}/order/cancel?orderId=${orderId}`,
        });
    }

    async retrieveSession(sessionId: string) {
        return this.stripe.checkout.sessions.retrieve(sessionId);
    }
}
