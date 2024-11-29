import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../../shared/email/email.service';
import { NotificationEvent } from '../../shared/events/notification.event';

@Injectable()
export class NotificationListener {
    constructor(private readonly emailService: EmailService) {}

    @OnEvent('notification')
    async handleNotificationEvent(event: NotificationEvent) {
        switch (event.type) {
        case 'userRegistered':
            await this.emailService.sendUserRegisteredNotification(
                event.payload
            );
            break;

        case 'paymentCompleted':
            await this.emailService.sendPaymentNotification(event.payload);
            break;

        case 'paymentInitiated':
            await this.emailService.sendPaymentInitiationNotification(
                event.payload
            );
            break;

        case 'orderCanceled':
            await this.emailService.sendOrderCancellationNotification(
                event.payload
            );
            break;
        default:
            console.warn(`Unhandled notification type: ${event.type}`);
        }
    }
}
