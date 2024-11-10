import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/roles.enum';
import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';
import * as path from 'path';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.Admin)
export class AdminController {
    @Get('/logs')
    getLogs(): string {
        const logFileName = `system-${new Date().toISOString().slice(0, 10)}.log`;
        const logFilePath = path.join('./logs', logFileName);

        if (fs.existsSync(logFilePath)) {
            return fs.readFileSync(logFilePath, 'utf8');
        } else {
            return 'No logs available for today';
        }
    }
}
