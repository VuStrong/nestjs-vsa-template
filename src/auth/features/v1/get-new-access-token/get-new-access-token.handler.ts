import { HttpStatus } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import User from 'src/data/entities/user.entity';
import RefreshToken from 'src/data/entities/refresh-token.entity';
import { AppErrorCode } from 'src/common/app-error-code';
import { AppException } from 'src/common/exceptions/app.exception';
import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';
import {
    GetNewAccessTokenCommand,
} from './get-new-access-token.command';
import { GetNewAccessTokenResponseDto } from './get-new-access-token.dto';

@CommandHandler(GetNewAccessTokenCommand)
export class GetNewAccessTokenHandler
    implements ICommandHandler<GetNewAccessTokenCommand>
{
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private readonly refreshTokensRepository: Repository<RefreshToken>,
        private readonly jwtService: JwtService,
    ) {}

    async execute(
        command: GetNewAccessTokenCommand,
    ): Promise<GetNewAccessTokenResponseDto> {
        const user = await this.usersRepository.findOne({
            where: { id: command.userId },
            select: {
                id: true,
                email: true,
                emailConfirmed: true,
                lockoutEnd: true,
            },
        });

        if (!user) {
            throw new ResourceNotFoundException('User', command.userId);
        }

        if (user.isLocked()) {
            throw new AppException(
                'Account is locked',
                HttpStatus.FORBIDDEN,
                AppErrorCode.ACCOUNT_LOCKED_OUT,
            );
        }

        const token = await this.refreshTokensRepository.findOne({
            where: {
                userId: user.id,
                token: command.refreshToken,
            },
        });

        if (!token || token.expiryTime < new Date()) {
            throw new AppException(
                'Invalid refresh token',
                HttpStatus.UNAUTHORIZED,
                AppErrorCode.AUTHENTICATION_ERROR,
            );
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            emailConfirmed: user.emailConfirmed,
        });

        return {
            accessToken,
        };
    }
}
