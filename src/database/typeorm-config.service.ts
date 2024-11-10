import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const isProduction =
            this.configService.get<string>('environment') === 'production';

        const productionConfig: TypeOrmModuleOptions = {
            type: 'postgres',
            url: this.configService.get<string>('database.url'),
            ssl: { rejectUnauthorized: false },
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
            synchronize: false,
            logging: false,
        };

        const developmentConfig: TypeOrmModuleOptions = {
            type: 'postgres',
            host: this.configService.get<string>('database.host'),
            port: this.configService.get<number>('database.port'),
            username: this.configService.get<string>('database.username'),
            password: this.configService.get<string>('database.password'),
            database: this.configService.get<string>('database.name'),
            ssl: false,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
            synchronize: true,
            logging: true,
        };

        return isProduction ? productionConfig : developmentConfig;
    }
}
