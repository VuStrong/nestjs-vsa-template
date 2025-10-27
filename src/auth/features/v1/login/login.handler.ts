import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import crypto from "crypto";

import { AppException } from 'src/common/exceptions/app.exception';
import { AppErrorCode } from 'src/common/app-error-code';
import User from 'src/data/entities/user.entity';
import RefreshToken from 'src/data/entities/refresh-token.entity';
import { LoginCommand, LoginResponse } from './login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private readonly refreshTokensRepository: Repository<RefreshToken>,
        private readonly jwtService: JwtService,
    ) {}

    async execute(command: LoginCommand): Promise<LoginResponse> {
        const user = await this.usersRepository.findOne({
            where: { email: command.email },
            select: {
                id: true,
                email: true,
                emailConfirmed: true,
                lockoutEnd: true,
                hashedPassword: true,
            },
        });

        if (!user) {
            throw new AppException(
                'Email or password is not correct',
                HttpStatus.UNAUTHORIZED,
                AppErrorCode.AUTHENTICATION_ERROR,
            );
        }

        // Password maybe null if sign up with external login method.
        if (user.hashedPassword === null) {
            throw new AppException(
                'Your account is not registered with email and password. Try using another login method or reset your password',
                HttpStatus.UNAUTHORIZED,
                AppErrorCode.LOGIN_PASSWORD_NOT_SET,
            );
        }

        const isPasswordMatched = await bcrypt.compare(
            command.password,
            user.hashedPassword,
        );

        if (!isPasswordMatched) {
            throw new AppException(
                'Email or password is not correct',
                HttpStatus.UNAUTHORIZED,
                AppErrorCode.AUTHENTICATION_ERROR,
            );
        }

        if (user.isLocked()) {
            throw new AppException(
                'Account is locked',
                HttpStatus.FORBIDDEN,
                AppErrorCode.ACCOUNT_LOCKED_OUT,
            );
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            emailConfirmed: user.emailConfirmed,
        });
        const refreshToken = await this.generateRefreshToken(user.id);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async generateRefreshToken(userId: string): Promise<string> {
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const expiryTime = new Date();
        expiryTime.setDate(expiryTime.getDate() + 60); // 60 days
        
        const token = this.refreshTokensRepository.create({
            userId,
            token: refreshToken,
            expiryTime,
        });

        await this.refreshTokensRepository.insert(token);

        return refreshToken;
    }
}
