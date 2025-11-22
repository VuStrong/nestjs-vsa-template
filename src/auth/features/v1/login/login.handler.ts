import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import crypto from "crypto";

import { AppException } from 'src/common/exceptions/app.exception';
import User from 'src/data/entities/user.entity';
import RefreshToken from 'src/data/entities/refresh-token.entity';
import { LoginCommand } from './login.command';
import { LoginResponseDto } from './login.dto';
import { AppError } from 'src/common/app.error';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private readonly refreshTokensRepository: Repository<RefreshToken>,
        private readonly jwtService: JwtService,
    ) {}

    async execute(command: LoginCommand): Promise<LoginResponseDto> {
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
            throw new AppException(AppError.INVALID_CREDENTIALS);
        }

        // Password maybe null if sign up with external login method.
        if (user.hashedPassword === null) {
            throw new AppException(AppError.LOGIN_PASSWORD_NOT_SET);
        }

        const isPasswordMatched = await bcrypt.compare(
            command.password,
            user.hashedPassword,
        );

        if (!isPasswordMatched) {
            throw new AppException(AppError.INVALID_CREDENTIALS);
        }

        if (user.isLocked()) {
            throw new AppException(AppError.USER_LOCKED);
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
