import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { plainToInstance } from 'class-transformer';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createUser(registerDto: RegisterDto): Promise<User> {
        const existingUser = await this.findOneByEmail(registerDto.email);
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const user = this.userRepository.create(registerDto);
        return await this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOneById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }

    async updateProfile(
        userId: number,
        updateProfileDto: UpdateProfileDto
    ): Promise<UserProfileResponseDto> {
        const user = await this.findOneById(userId);
        Object.assign(user, updateProfileDto);
        const updatedUser = await this.userRepository.save(user);

        return plainToInstance(UserProfileResponseDto, updatedUser);
    }

    async removeUser(id: number): Promise<void> {
        const user = await this.findOneById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        await this.userRepository.remove(user);
    }

    async getProfile(userId: number): Promise<UserProfileResponseDto> {
        const user = await this.findOneById(userId);
        return plainToInstance(UserProfileResponseDto, user);
    }
}
