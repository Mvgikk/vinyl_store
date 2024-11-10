import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { plainToInstance } from 'class-transformer';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    async createUser(registerDto: RegisterDto): Promise<User> {
        const existingUser = await this.findOneByEmail(registerDto.email);
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const user = this.userRepository.create(registerDto);
        const savedUser = await this.userRepository.save(user);
        this.logger.info(`Created new user with ID: ${savedUser.id}`, {
            action: 'createUser',
            userId: savedUser.id,
        });
        return savedUser;
    }

    async findAll(): Promise<User[]> {
        const users = await this.userRepository.find();
        this.logger.info('Fetched all users', {
            action: 'findAll',
            userCount: users.length,
        });
        return users;
    }

    async findOneById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        this.logger.info(`Fetched user with ID: ${id}`, {
            action: 'findOneById',
            userId: id,
        });
        return user;
    }

    async findOneByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        this.logger.info(`Fetched user with email: ${email}`, {
            action: 'findOneByEmail',
            email,
        });
        return user;
    }

    async updateProfile(
        userId: number,
        updateProfileDto: UpdateProfileDto
    ): Promise<UserProfileResponseDto> {
        const user = await this.findOneById(userId);
        Object.assign(user, updateProfileDto);
        const updatedUser = await this.userRepository.save(user);
        this.logger.info(`Updated profile for user ID: ${userId}`, {
            action: 'updateProfile',
            userId,
            changes: updateProfileDto,
        });
        return plainToInstance(UserProfileResponseDto, updatedUser);
    }

    async removeUser(id: number): Promise<void> {
        const user = await this.findOneById(id);
        await this.userRepository.remove(user);
        this.logger.info(`Removed user with ID: ${id}`, {
            action: 'removeUser',
            userId: id,
        });
    }

    async getProfile(userId: number): Promise<UserProfileResponseDto> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: [
                'reviews',
                'orders',
                'orders.orderItems',
                'orders.orderItems.vinyl',
            ],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const purchasedVinyls = user.orders
            .filter((order) => order.status === 'completed')
            .flatMap((order) => order.orderItems.map((item) => item.vinyl));

        const userProfile = plainToInstance(UserProfileResponseDto, {
            ...user,
            reviews: user.reviews,
            purchasedVinyls,
        });

        this.logger.info(`Fetched profile for user ID: ${userId}`, {
            action: 'getProfile',
            userId,
        });

        return userProfile;
    }
}
