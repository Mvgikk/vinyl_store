import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    token: string;

    @CreateDateColumn()
    createdAt: Date;
}
