import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Session } from './session.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    private readonly sessionExpiryTime = 60 * 60 * 1000;

    async initializeSession(userId: number): Promise<Session> {
        const session = this.sessionRepository.create({ userId, token: '' });
        const savedSession = await this.sessionRepository.save(session);
        this.logger.info(
            `Initialized session with ID: ${savedSession.id} for user ID: ${userId}`,
            {
                action: 'initialize',
                userId,
                sessionId: savedSession.id,
            }
        );
        return savedSession;
    }

    async finalizeSession(session: Session, token: string): Promise<Session> {
        session.token = token;
        const finalizedSession = await this.sessionRepository.save(session);
        this.logger.info(
            `Finished initializing session with ID: ${finalizedSession.id}`,
            {
                action: 'finalize',
                sessionId: finalizedSession.id,
                token,
            }
        );
        return finalizedSession;
    }

    async deleteSession(sessionId: number) {
        await this.sessionRepository.delete({ id: sessionId });
        this.logger.info(`Deleted session with ID: ${sessionId}`, {
            action: 'delete',
            sessionId,
        });
    }

    async findOneById(sessionId: number): Promise<Session | null> {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId },
        });
        if (!session) {
            return null;
        }
        this.logger.info(`Found session with ID: ${sessionId}`, {
            action: 'findOneById',
            sessionId,
        });
        return session;
    }
    async validateSession(sessionId: number): Promise<boolean> {
        const session = await this.findOneById(sessionId);
        const isValid = !!session;
        this.logger.info(
            `Validated session with ID: ${sessionId} - Valid: ${isValid}`,
            {
                action: 'validate',
                sessionId,
                isValid,
            }
        );
        return isValid;
    }

    async deleteExpiredSessions(): Promise<number> {
        const expiryDate = new Date(Date.now() - this.sessionExpiryTime);
        const deleteResult = await this.sessionRepository.delete({
            createdAt: LessThan(expiryDate),
        });
        return deleteResult.affected || 0;
    }
}
