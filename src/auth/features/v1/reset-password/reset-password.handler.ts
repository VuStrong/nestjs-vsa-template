import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import User from 'src/data/entities/user.entity';
import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';
import { AppException } from 'src/common/exceptions/app.exception';
import { AppErrorCode } from 'src/common/app-error-code';
import { ResetPasswordCommand } from './reset-password.command';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
    implements ICommandHandler<ResetPasswordCommand>
{
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async execute(command: ResetPasswordCommand): Promise<void> {
        const user = await this.usersRepository.findOne({
            where: { id: command.userId },
            select: {
                id: true,
                passwordResetToken: true,
                passwordResetTokenExpiryTime: true,
            },
        });

        if (!user) {
            throw new ResourceNotFoundException('User', command.userId);
        }

        if (
            user.passwordResetToken &&
            user.passwordResetTokenExpiryTime &&
            command.token === user.passwordResetToken &&
            user.passwordResetTokenExpiryTime > new Date()
        ) {
            const hashedPassword = await bcrypt.hash(command.newPassword, 10);

            await this.usersRepository.update(
                { id: user.id },
                {
                    hashedPassword,
                    passwordResetToken: null,
                    passwordResetTokenExpiryTime: null,
                },
            );
        } else {
            throw new AppException(
                'Invalid token',
                403,
                AppErrorCode.FORBIDDEN_ACTION,
            );
        }
    }
}
