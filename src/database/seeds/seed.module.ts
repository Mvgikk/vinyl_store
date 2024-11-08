import { Module } from '@nestjs/common';
import { UserSeedModule } from './user/user-seed.module';
import { VinylSeedModule } from './vinyl/vinyl-seed.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { ConfigModule } from '@nestjs/config';
import development from 'config/development';
import { SharedModule } from 'src/shared/shared.module';

@Module({
    imports: [
        SharedModule,
        UserSeedModule,
        VinylSeedModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [development],
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
    ],
})
export class SeedModule {}
