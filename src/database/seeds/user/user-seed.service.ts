import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../user/entities/user.entity';

@Injectable()
export class UserSeedService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async run() {
        const users = [
            {
                email: 'testuser1@example.com',
                password: 'hashedpassword1',
                firstName: 'John',
                lastName: 'Doe',
                birthdate: new Date('1980-05-12'),
                role: 'user',
            },
            {
                email: 'testuser2@example.com',
                password: 'hashedpassword2',
                firstName: 'Jane',
                lastName: 'Doe',
                birthdate: new Date('1985-06-22'),
                role: 'user',
            },
            {
                email: 'testuser3@example.com',
                password: 'hashedpassword3',
                firstName: 'Alice',
                lastName: 'Smith',
                birthdate: new Date('1992-09-15'),
                role: 'user',
            },
            {
                email: 'testuser4@example.com',
                password: 'hashedpassword4',
                firstName: 'Bob',
                lastName: 'Brown',
                birthdate: new Date('1991-03-08'),
                role: 'user',
            },
            {
                email: 'testuser5@example.com',
                password: 'hashedpassword5',
                firstName: 'Charlie',
                lastName: 'Wilson',
                birthdate: new Date('1994-11-25'),
                role: 'user',
            },
            {
                email: 'testuser6@example.com',
                password: 'hashedpassword6',
                firstName: 'David',
                lastName: 'Taylor',
                birthdate: new Date('1989-02-14'),
                role: 'user',
            },
            {
                email: 'testuser7@example.com',
                password: 'hashedpassword7',
                firstName: 'Eve',
                lastName: 'Johnson',
                birthdate: new Date('1996-07-19'),
                role: 'user',
            },
            {
                email: 'testuser8@example.com',
                password: 'hashedpassword8',
                firstName: 'Frank',
                lastName: 'Lee',
                birthdate: new Date('1993-08-30'),
                role: 'user',
            },
            {
                email: 'testuser9@example.com',
                password: 'hashedpassword9',
                firstName: 'Grace',
                lastName: 'Martin',
                birthdate: new Date('1988-12-03'),
                role: 'user',
            },
            {
                email: 'testuser10@example.com',
                password: 'hashedpassword10',
                firstName: 'Henry',
                lastName: 'Lewis',
                birthdate: new Date('1995-04-17'),
                role: 'user',
            },
        ];

        await this.userRepository.save(users);
        console.log('Users seeded successfully!');
    }

    async clear() {
        await this.userRepository.query('TRUNCATE TABLE "user" CASCADE');
        console.log('Users cleared successfully!');
    }
}
