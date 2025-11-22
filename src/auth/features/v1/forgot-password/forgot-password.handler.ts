import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import type { ConfigType } from '@nestjs/config';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

import User from 'src/data/entities/user.entity';
import type { MailService } from 'src/mail/mail.service';
import { MAIL_SERVICE } from 'src/mail/mail.di-tokens';
import appConfig from 'src/config/app.config';
import { ForgotPasswordCommand } from './forgot-password.command';
import { AppException } from 'src/common/exceptions/app.exception';
import { AppError } from 'src/common/app.error';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
    implements ICommandHandler<ForgotPasswordCommand>
{
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @Inject(appConfig.KEY)
        private readonly appCfg: ConfigType<typeof appConfig>,
        @Inject(MAIL_SERVICE)
        private readonly mailService: MailService,
    ) {}

    async execute(command: ForgotPasswordCommand): Promise<void> {
        const email = command.email.trim().toLowerCase();

        if (!email) {
            throw new AppException({
                ...AppError.VALIDATION_ERROR,
                message: 'Field email is missing',
            });
        }

        const user = await this.usersRepository.findOne({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (!user) {
            throw AppException.newResourceNotFoundException('User', 'email', email);
        }

        const token = randomBytes(64).toString('hex');
        const expiryTime = new Date();
        expiryTime.setDate(expiryTime.getDate() + 1);

        const webUrl = this.appCfg.webClientResetPasswordUrl;
        const link = `${webUrl}?token=${token}&userId=${user.id}`;

        await this.usersRepository.update(
            { id: user.id },
            {
                passwordResetToken: token,
                passwordResetTokenExpiryTime: expiryTime,
            },
        );

        // Should be using a message queue (rabbitmq, kafka,...) instead of sending email directly here
        this.mailService.sendMail({
            to: user.email,
            subject: 'Reset password',
            template: 'reset-password',
            context: {
                username: user.name,
                link,
            },
        });
    }
}
