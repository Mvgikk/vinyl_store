import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/roles.enum';
import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';
import * as path from 'path';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.Admin)
export class AdminController {
    @ApiOperation({
        summary: 'Retrieve system logs for the current day (Admin only)',
    })
    @ApiResponse({ status: 200, description: 'Logs retrieved successfully' })
    @ApiResponse({ status: 404, description: 'No logs available for today' })
    @Get('/logs')
    getLogs(): string {
        const logFileName = `system-${new Date().toISOString().slice(0, 10)}.log`;
        const logFilePath = path.join('./logs', logFileName);

        if (fs.existsSync(logFilePath)) {
            return fs.readFileSync(logFilePath, 'utf8');
        }
        return 'No logs available for today';
    }
}
