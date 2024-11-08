import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { JwtPayloadType } from '../../auth/types/jwt-payload.type';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            'roles',
            [context.getHandler(), context.getClass()]
        );

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        const userRole = (user as JwtPayloadType).role;

        if (!requiredRoles.includes(userRole as Role)) {
            throw new ForbiddenException('You do not have permission');
        }

        return true;
    }
}
