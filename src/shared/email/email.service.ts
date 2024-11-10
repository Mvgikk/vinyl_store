import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    async sendUserRegisteredNotification(payload: {
        email: string;
        firstName: string;
        lastName: string;
    }) {
        const { email, firstName, lastName } = payload;

        const mailOptions = {
            from: this.configService.get<string>('email.user'),
            to: email,
            subject: 'Welcome to Vinyl Store',
            text: `Hello ${firstName + ' ' + lastName}, your profile has been successfully registered!`,
        };

        try {
            const info = await this.mailerService.sendMail(mailOptions);
            this.logger.info(
                `Email sent successfully to ${email}: ${info.response}`,
                {
                    action: 'sendUserRegisteredNotification',
                    email,
                }
            );
        } catch (error) {
            this.logger.error(
                `Failed to send email to ${email}: ${error.message}`,
                {
                    action: 'sendUserRegisteredNotification',
                    email,
                }
            );
        }
    }

    async sendPaymentNotification(payload: {
        email: string;
        orderId: number;
        price: number;
    }) {
        const { email, orderId, price } = payload;
        const mailOptions = {
            from: this.configService.get<string>('email.user'),
            to: email,
            subject: 'Payment Confirmation',
            text: `Thank you for your purchase! Your payment of $${price} for order #${orderId} has been received successfully.`,
        };

        try {
            const info = await this.mailerService.sendMail(mailOptions);
            this.logger.info(
                `Payment notification sent to ${email}: ${info.response}`,
                {
                    action: 'sendPaymentNotification',
                    email,
                }
            );
        } catch (error) {
            this.logger.error(
                `Failed to send payment notification to ${email}: ${error.message}`,
                {
                    action: 'sendPaymentNotification',
                    email,
                }
            );
        }
    }

    async sendPaymentInitiationNotification(payload: {
        email: string;
        orderId: number;
        price: number;
    }) {
        const { email, orderId, price } = payload;
        const mailOptions = {
            from: this.configService.get<string>('email.user'),
            to: email,
            subject: 'Payment Initiated',
            text: `Your payment of $${price} for order #${orderId} has been initiated. Please complete your payment to confirm the order.`,
        };

        try {
            const info = await this.mailerService.sendMail(mailOptions);
            this.logger.info(
                `Payment initiation email sent to ${email}: ${info.response}`,
                {
                    action: 'sendPaymentInitiationNotification',
                    email,
                }
            );
        } catch (error) {
            this.logger.error(
                `Failed to send payment initiation email to ${email}: ${error.message}`,
                {
                    action: 'sendPaymentInitiationNotification',
                    email,
                }
            );
        }
    }

    async sendOrderCancellationNotification(payload: {
        email: string;
        orderId: number;
    }) {
        const { email, orderId } = payload;
        const mailOptions = {
            from: this.configService.get<string>('email.user'),
            to: email,
            subject: 'Order Canceled',
            text: `Your order #${orderId} has been canceled. If this was a mistake, please place a new order.`,
        };

        try {
            const info = await this.mailerService.sendMail(mailOptions);
            this.logger.info(
                `Order cancellation email sent to ${email}: ${info.response}`,
                {
                    action: 'sendOrderCancellationNotification',
                    email,
                }
            );
        } catch (error) {
            this.logger.error(
                `Failed to send order cancellation email to ${email}: ${error.message}`,
                {
                    action: 'sendOrderCancellationNotification',
                    email,
                }
            );
        }
    }
}
