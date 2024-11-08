import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
        id: number;

    @Column('decimal')
        totalPrice: number;

    @Column()
        status: string;

    @CreateDateColumn()
        createdAt: Date;

    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
        user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
        cascade: true,
        onDelete: 'CASCADE',
    })
        orderItems: OrderItem[];
}
