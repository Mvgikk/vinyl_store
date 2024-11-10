import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { NotificationListener } from './listeners/notification.listener';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '../logger/winston-logger.config';

@Module({
    imports: [
        WinstonModule.forRoot(winstonConfig),
        ConfigModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('email.host'),
                    port: configService.get<number>('email.port'),
                    secure: configService.get<boolean>('email.secure'),
                    auth: {
                        user: configService.get<string>('email.user'),
                        pass: configService.get<string>('email.password'),
                    },
                },
            }),
        }),
    ],
    providers: [HashingService, EmailService, NotificationListener],
    exports: [HashingService, EmailService, NotificationListener,],
})
export class SharedModule {}
