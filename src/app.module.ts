import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import development from 'config/development';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { VinylModule } from './vinyl/vinyl.module';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { SessionModule } from './session/session.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston-logger.config';
import { AdminModule } from './admin/admin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import production from 'config/production';
import test from 'config/test';

@Module({
    imports: [
        WinstonModule.forRoot(winstonConfig),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                process.env.NODE_ENV === 'production'
                    ? production
                    : process.env.NODE_ENV === 'test'
                      ? test
                      : development,
            ],
            envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        UserModule,
        VinylModule,
        ReviewModule,
        OrderModule,
        AuthModule,
        SharedModule,
        SessionModule,
        AdminModule,
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}
