import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayloadType } from './types/jwt-payload.type';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly hashingService: HashingService
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findOneByEmail(email);
        if (user && await this.hashingService.comparePassword(password, user.password)) {
            return user;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const payload: JwtPayloadType = {
            id: user.id,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: RegisterDto) {
        const hashedPassword = this.hashingService.hashPassword(registerDto.password);
        const userToCreate = { ...registerDto, password: hashedPassword };
        return await this.userService.createUser(userToCreate);
    }
}
