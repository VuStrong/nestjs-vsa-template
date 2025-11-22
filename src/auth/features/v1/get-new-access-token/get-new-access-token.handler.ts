import { HttpStatus } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import User from 'src/data/entities/user.entity';
import RefreshToken from 'src/data/entities/refresh-token.entity';
import { AppException } from 'src/common/exceptions/app.exception';
import {
    GetNewAccessTokenCommand,
} from './get-new-access-token.command';
import { GetNewAccessTokenResponseDto } from './get-new-access-token.dto';
import { AppError } from 'src/common/app.error';

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
            throw AppException.newResourceNotFoundException('User', 'id', command.userId);
        }

        if (user.isLocked()) {
            throw new AppException(AppError.USER_LOCKED);
        }

        const token = await this.refreshTokensRepository.findOne({
            where: {
                userId: user.id,
                token: command.refreshToken,
            },
        });

        if (!token || token.expiryTime < new Date()) {
            throw new AppException(AppError.TOKEN_INVALID);
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
