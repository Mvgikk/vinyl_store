import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { StripeService } from './stripe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { VinylModule } from '../vinyl/vinyl.module';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem]),
        VinylModule,
        UserModule,
        SharedModule,
    ],
    controllers: [OrderController],
    providers: [OrderService, StripeService],
})
export class OrderModule {}
