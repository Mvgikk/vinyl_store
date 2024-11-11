import { Module } from '@nestjs/common';
import { UserSeedModule } from './user/user-seed.module';
import { VinylSeedModule } from './vinyl/vinyl-seed.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../../shared/shared.module';
import development from '../../../config/development';
import production from '../../../config/production';
import test from '../../../config/test';

@Module({
    imports: [
        SharedModule,
        UserSeedModule,
        VinylSeedModule,
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
    ],
})
export class SeedModule {}
