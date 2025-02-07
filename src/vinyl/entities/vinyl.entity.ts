import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Review } from '../../review/entities/review.entity';
import { OrderItem } from '../../order/entities/order-item.entity';

@Entity()
export class Vinyl {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    author: string;

    @Column({ nullable: true })
    description: string;

    @Column('decimal')
    price: number;

    @Column({ nullable: true })
    image: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Review, (review) => review.vinyl, { cascade: true })
    reviews: Review[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.vinyl)
    orderItems: OrderItem[];
}
