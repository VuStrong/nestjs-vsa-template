import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AppException } from '../exceptions/app.exception';
import { AppErrorCode } from '../app-error-code';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new Error('User not found in request');
        }

        const allow = requiredRoles.some((role) => user.role === role);
        // If user have multiple roles:
        // const allow = requiredRoles.some((role) => user.roles?.includes(role));

        if (allow) {
            return true;
        } else {
            throw new AppException(
                'Forbidden resource',
                403,
                AppErrorCode.FORBIDDEN_ACTION,
            );
        }
    }
}
