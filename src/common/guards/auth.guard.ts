import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ALLOW_ANONYMOUS_KEY } from '../decorators/allow-anonymous.decorator';
import { AppException } from '../exceptions/app.exception';
import jwtConfig from 'src/config/jwt.config';
import { AppError } from '../app.error';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtCfg: ConfigType<typeof jwtConfig>,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            if (this.checkAllowAnonymous(context)) return true;

            throw new AppException(AppError.UNAUTHORIZED);
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.jwtCfg.secret,
            });

            request['user'] = payload;

            return true;
        } catch {
            if (this.checkAllowAnonymous(context)) return true;

            throw new AppException(AppError.UNAUTHORIZED);
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
