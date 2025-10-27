import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ALLOW_ANONYMOUS_KEY } from '../decorators/allow-anonymous.decorator';
import { AppException } from '../exceptions/app.exception';
import { AppErrorCode } from '../app-error-code';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            if (this.checkAllowAnonymous(context)) return true;

            throw new AppException(
                'Unauthorized',
                HttpStatus.UNAUTHORIZED,
                AppErrorCode.AUTHENTICATION_ERROR,
            );
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('jwt.secret'),
            });

            request['user'] = payload;

            return true;
        } catch {
            if (this.checkAllowAnonymous(context)) return true;

            throw new AppException(
                'Unauthorized',
                HttpStatus.UNAUTHORIZED,
                AppErrorCode.AUTHENTICATION_ERROR,
            );
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private checkAllowAnonymous(context: ExecutionContext): boolean {
        return this.reflector.getAllAndOverride<boolean>(ALLOW_ANONYMOUS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
    }
}
