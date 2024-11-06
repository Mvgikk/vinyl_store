import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Vinyl } from '../../vinyl/entities/vinyl.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
        id: number;

    @Column('int')
        rating: number;

    @Column('text', { nullable: true })
        comment: string;

    @CreateDateColumn()
        createdAt: Date;

    @ManyToOne(() => User, user => user.reviews)
        user: User;

    @ManyToOne(() => Vinyl, vinyl => vinyl.reviews)
        vinyl: Vinyl;
}
