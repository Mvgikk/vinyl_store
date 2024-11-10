import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;

        res.on('finish', () => {
            const statusCode = res.statusCode;
            this.logger.info(
                `[Request] ${method} ${originalUrl} ${statusCode}`,
                {
                    method,
                    originalUrl,
                    statusCode,
                }
            );
        });

        next();
    }
}
