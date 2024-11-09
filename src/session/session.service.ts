import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>
    ) {}

    async initializeSession(userId: number): Promise<Session> {
        const session = this.sessionRepository.create({ userId, token: '' });
        return await this.sessionRepository.save(session);
    }

    async finalizeSession(session: Session, token: string): Promise<Session> {
        session.token = token;
        return await this.sessionRepository.save(session);
    }

    async deleteSession(sessionId: number) {
        await this.sessionRepository.delete({ id: sessionId });
    }

    async validateSession(sessionId: number): Promise<boolean> {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId },
        });
        return !!session;
    }
}
