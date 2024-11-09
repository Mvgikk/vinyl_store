import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('port');
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector))
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(port);
}
bootstrap();
