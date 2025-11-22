import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from 'src/data/entities/user.entity';
import { AppException } from 'src/common/exceptions/app.exception';
import { ConfirmEmailCommand } from './confirm-email.command';
import { AppError } from 'src/common/app.error';

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailHandler
    implements ICommandHandler<ConfirmEmailCommand>
{
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async execute(command: ConfirmEmailCommand): Promise<void> {
        const user = await this.usersRepository.findOne({
            where: { id: command.userId },
            select: {
                emailConfirmed: true,
                emailConfirmationToken: true,
                emailConfirmationTokenExpiryTime: true,
            },
        });

        if (!user) {
            throw AppException.newResourceNotFoundException('User', 'id', command.userId);
        }

        if (user.emailConfirmed) {
            return;
        }

        if (
            user.emailConfirmationToken &&
            user.emailConfirmationTokenExpiryTime &&
            command.token === user.emailConfirmationToken &&
            user.emailConfirmationTokenExpiryTime > new Date()
        ) {
            await this.usersRepository.update(
                { id: command.userId },
                {
                    emailConfirmed: true,
                    emailConfirmationToken: null,
                    emailConfirmationTokenExpiryTime: null,
                },
            );
        } else {
            throw new AppException(AppError.TOKEN_INVALID);
        }
    }
}
