import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vinyl } from '../../vinyl/entities/vinyl.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
        id: number;

    @Column('int')
        quantity: number;

    @ManyToOne(() => Vinyl, (vinyl) => vinyl.orderItems)
        vinyl: Vinyl;

    @ManyToOne(() => Order, (order) => order.orderItems)
        order: Order;
}
