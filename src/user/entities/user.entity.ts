import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

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
}
