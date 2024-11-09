import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionService } from './session.service';

@Injectable()
export class SessionCleanupService {
    constructor(private readonly sessionService: SessionService) {}

    @Cron(CronExpression.EVERY_HOUR)
    async handleExpiredSessionsCleanup() {
        await this.sessionService.deleteExpiredSessions();
    }
}
