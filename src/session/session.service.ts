import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>
    ) {}

    async createSession(userId: number, token: string) {
        const session = this.sessionRepository.create({ userId, token });
        return await this.sessionRepository.save(session);
    }

    async deleteSession(token: string) {
        await this.sessionRepository.delete({ token });
    }

    async validateSession(token: string): Promise<void> {
        const session = await this.sessionRepository.findOne({
            where: { token },
        });
        if (!session) {
            throw new UnauthorizedException('Invalid or expired session');
        }
    }
}
