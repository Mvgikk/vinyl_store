import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadType } from '../types/jwt-payload.type';
import { SessionService } from '../../session/session.service';

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
        const isActiveSession = await this.sessionService.validateSession(
            payload.sessionId
        );

        if (!isActiveSession) {
            throw new UnauthorizedException(
                'Session has expired or is invalid.'
            );
        }
        return {
            userId: payload.id,
            email: payload.email,
            role: payload.role,
            sessionId: payload.sessionId,
        };
    }
}
