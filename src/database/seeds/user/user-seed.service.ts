import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserSeedService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly hashingService: HashingService,
        private readonly configService: ConfigService
    ) {}

    async run() {
        const users = [
            {
                email: 'testuser1@example.com',
                password: 'password1',
                firstName: 'John',
                lastName: 'Doe',
                birthdate: new Date('1980-05-12'),
                role: 'user',
            },
            {
                email: 'testuser2@example.com',
                password: 'password2',
                firstName: 'Jane',
                lastName: 'Doe',
                birthdate: new Date('1985-06-22'),
                role: 'user',
            },
            {
                email: 'testuser3@example.com',
                password: 'password3',
                firstName: 'Alice',
                lastName: 'Smith',
                birthdate: new Date('1992-09-15'),
                role: 'user',
            },
            {
                email: 'testuser4@example.com',
                password: 'password4',
                firstName: 'Bob',
                lastName: 'Brown',
                birthdate: new Date('1991-03-08'),
                role: 'user',
            },
            {
                email: 'testuser5@example.com',
                password: 'password5',
                firstName: 'Charlie',
                lastName: 'Wilson',
                birthdate: new Date('1994-11-25'),
                role: 'user',
            },
            {
                email: 'testuser6@example.com',
                password: 'password6',
                firstName: 'David',
                lastName: 'Taylor',
                birthdate: new Date('1989-02-14'),
                role: 'user',
            },
            {
                email: 'testuser7@example.com',
                password: 'password7',
                firstName: 'Eve',
                lastName: 'Johnson',
                birthdate: new Date('1996-07-19'),
                role: 'user',
            },
            {
                email: 'testuser8@example.com',
                password: 'password8',
                firstName: 'Frank',
                lastName: 'Lee',
                birthdate: new Date('1993-08-30'),
                role: 'user',
            },
            {
                email: 'testuser9@example.com',
                password: 'password9',
                firstName: 'Grace',
                lastName: 'Martin',
                birthdate: new Date('1988-12-03'),
                role: 'user',
            },
            {
                email: 'testuser10@example.com',
                password: 'password10',
                firstName: 'Henry',
                lastName: 'Lewis',
                birthdate: new Date('1995-04-17'),
                role: 'user',
            },
        ];
        for (const user of users) {
            user.password = this.hashingService.hashPassword(user.password);
        }

        await this.userRepository.save(users);
        console.log('Users seeded successfully!');
    }

    async createAdmin() {
        const adminEmail = this.configService.get<string>('admin.email');
        const adminPassword = this.configService.get<string>('admin.password');
        const hashedPassword =
            await this.hashingService.hashPassword(adminPassword);

        const adminUser = {
            email: adminEmail,
            password: hashedPassword,
            firstName: 'Tomasz',
            lastName: 'Bartosik',
            role: 'admin',
            birthdate: '2000-08-06',
            avatarUrl: null,
        };
        await this.userRepository.save(adminUser);
    }

    async clear() {
        await this.userRepository.query('TRUNCATE TABLE "user" CASCADE');
        console.log('Users cleared successfully!');
    }
}
