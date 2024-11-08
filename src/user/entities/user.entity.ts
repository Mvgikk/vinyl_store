import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { Review } from '../../review/entities/review.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({ unique: true })
        email: string;

    @Column({ nullable: true })
        password: string;

    @Column()
        firstName: string;

    @Column()
        lastName: string;

    @Column({ type: 'date' })
        birthdate: Date;

    @Column({ nullable: true })
        avatarUrl: string;

    @Column({ default: 'user' })
        role: string;

    @CreateDateColumn()
        createdAt: Date;

    @UpdateDateColumn()
        updatedAt: Date;

    @OneToMany(() => Order, (order) => order.user)
        orders: Order[];

    @OneToMany(() => Review, (review) => review.user)
        reviews: Review[];
}
