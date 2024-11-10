import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionService } from './session.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class SessionCleanupService {
    constructor(
        private readonly sessionService: SessionService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    async handleExpiredSessionsCleanup() {
        this.logger.info('SESSION CLEANUP');
        const deletedSessionsCount =
            await this.sessionService.deleteExpiredSessions();
        this.logger.info(
            `Expired sessions cleanup completed. Deleted ${deletedSessionsCount} sessions.`
        );
    }
}
