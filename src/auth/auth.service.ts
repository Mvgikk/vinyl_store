import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayloadType } from './types/jwt-payload.type';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { User } from 'src/user/entities/user.entity';
import { SessionService } from 'src/session/session.service';
import { UserProfileResponseDto } from 'src/user/dto/user-profile-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly hashingService: HashingService,
        private readonly sessionService: SessionService
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findOneByEmail(email);
        if (
            user &&
            (await this.hashingService.comparePassword(password, user.password))
        ) {
            return user;
        }
        return null;
    }

    async validateUserWithGoogle(email: string): Promise<User | null> {
        return await this.userService.findOneByEmail(email);
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const session = await this.sessionService.initializeSession(user.id);

        const payload: JwtPayloadType = {
            id: user.id,
            email: user.email,
            role: user.role,
            sessionId: session.id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
        };
        const token = this.jwtService.sign(payload);
        await this.sessionService.finalizeSession(session, token);

        return { access_token: token };
    }

    async register(registerDto: RegisterDto): Promise<UserProfileResponseDto> {
        const hashedPassword = await this.hashingService.hashPassword(
            registerDto.password
        );
        const userToCreate = { ...registerDto, password: hashedPassword };

        const newUser = await this.userService.createUser(userToCreate);

        return plainToInstance(UserProfileResponseDto, newUser);
    }

    async logout(sessionId: number) {
        await this.sessionService.deleteSession(sessionId);
        return { message: 'Successfully logged out' };
    }

    async loginWithGoogle(user: User) {
        const session = await this.sessionService.initializeSession(user.id);

        const payload: JwtPayloadType = {
            id: user.id,
            email: user.email,
            role: user.role,
            sessionId: session.id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
        };
        const token = this.jwtService.sign(payload);

        await this.sessionService.finalizeSession(session, token);

        return { access_token: token };
    }
}
