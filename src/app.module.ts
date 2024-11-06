import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import development from 'config/development';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { VinylModule } from './vinyl/vinyl.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [development],
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        UserModule,
        VinylModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
