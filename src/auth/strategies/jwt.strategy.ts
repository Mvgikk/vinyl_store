import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadType } from '../types/jwt-payload.type';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly sessionService: SessionService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('jwtSecret'),
        });
    }

    async validate(payload: JwtPayloadType) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(payload);

        await this.sessionService.validateSession(token);
        return {
            userId: payload.id,
            email: payload.email,
            role: payload.role,
        };
    }
}
