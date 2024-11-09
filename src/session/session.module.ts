import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { Session } from './session.entity';
import { SessionCleanupService } from './session-cleanup.service';

@Module({
    imports: [TypeOrmModule.forFeature([Session])],
    providers: [SessionService, SessionCleanupService],
    exports: [SessionService],
})
export class SessionModule {}
