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
        const user = this.userRepository.create({
            email: 'testuser32@example.com',
            password: 'hashedpassword',
            firstName: 'Test',
            lastName: 'User',
            birthdate: new Date('1990-01-01'),
            role: 'user',
        });
        await this.userRepository.save(user);
    }
}
