import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
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

    private readonly sessionExpiryTime = 60 * 60 * 1000;

    async deleteExpiredSessions(): Promise<number> {
        const expiryDate = new Date(Date.now() - this.sessionExpiryTime);
        const deleteResult = await this.sessionRepository.delete({
            createdAt: LessThan(expiryDate),
        });
        return deleteResult.affected || 0;
    }
}
