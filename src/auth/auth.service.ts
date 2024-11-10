import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayloadType } from './types/jwt-payload.type';
import { HashingService } from '../shared/hashing/hashing.service';
import { User } from '../user/entities/user.entity';
import { SessionService } from '../session/session.service';
import { UserProfileResponseDto } from '../user/dto/user-profile-response.dto';
import { plainToInstance } from 'class-transformer';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly hashingService: HashingService,
        private readonly sessionService: SessionService,
        private readonly eventEmitter: EventEmitter2,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findOneByEmail(email);
        if (
            user &&
            (await this.hashingService.comparePassword(password, user.password))
        ) {
            this.logger.info(`Validated user credentials for email: ${email}`, {
                action: 'validateUser',
                email,
            });
            return user;
        }
        this.logger.warn(`Invalid credentials for email: ${email}`, {
            action: 'validateUser',
            email,
        });
        return null;
    }

    async validateUserWithGoogle(email: string): Promise<User | null> {
        const user = await this.userService.findOneByEmail(email);
        this.logger.info(`Validated Google login for email: ${email}`, {
            action: 'validateUserWithGoogle',
            email,
        });
        return user;
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
        this.logger.info(`User with ID ${user.id} logged in`, {
            action: 'login',
            userId: user.id,
            sessionId: session.id,
        });

        return { access_token: token };
    }

    async register(registerDto: RegisterDto): Promise<UserProfileResponseDto> {
        const hashedPassword = await this.hashingService.hashPassword(
            registerDto.password
        );
        const userToCreate = { ...registerDto, password: hashedPassword };

        const newUser = await this.userService.createUser(userToCreate);
        this.logger.info(`New user registered with ID: ${newUser.id}`, {
            action: 'register',
            userId: newUser.id,
        });

        this.eventEmitter.emit('notification', {
            type: 'userRegistered',
            payload: {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
            },
        });

        return plainToInstance(UserProfileResponseDto, newUser);
    }

    async logout(sessionId: number) {
        await this.sessionService.deleteSession(sessionId);
        this.logger.info(`Session with ID ${sessionId} logged out`, {
            action: 'logout',
            sessionId,
        });

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
        this.logger.info(`User with ID ${user.id} logged in via Google`, {
            action: 'loginWithGoogle',
            userId: user.id,
            sessionId: session.id,
        });

        return { access_token: token };
    }
}
