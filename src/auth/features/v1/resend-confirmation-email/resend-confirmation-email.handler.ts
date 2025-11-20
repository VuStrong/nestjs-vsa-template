import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import type { ConfigType } from '@nestjs/config';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

import { ValidationException } from 'src/common/exceptions/validation.exception';
import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';
import User from 'src/data/entities/user.entity';
import { MAIL_SERVICE } from 'src/mail/mail.di-tokens';
import type { MailService } from 'src/mail/mail.service';
import appConfig from 'src/config/app.config';
import { ResendConfirmationEmailCommand } from './resend-confirmation-email.command';

@CommandHandler(ResendConfirmationEmailCommand)
export class ResendConfirmationEmailHandler
    implements ICommandHandler<ResendConfirmationEmailCommand>
{
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @Inject(appConfig.KEY)
        private readonly appCfg: ConfigType<typeof appConfig>,
        @Inject(MAIL_SERVICE)
        private readonly mailService: MailService,
    ) {}

    async execute(command: ResendConfirmationEmailCommand): Promise<void> {
        const email = command.email.trim().toLowerCase();

        if (!email) {
            throw new ValidationException('Field email is missing');
        }

        const user = await this.usersRepository.findOne({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                emailConfirmed: true,
            },
        });

        if (!user) {
            throw new ResourceNotFoundException('User', email);
        }

        if (!user.emailConfirmed) {
            const emailConfirmationToken = randomBytes(64).toString('hex');
            const expiryTime = new Date();
            expiryTime.setDate(expiryTime.getDate() + 1);

            const webUrl = this.appCfg.webClientConfirmEmailUrl;
            const link = `${webUrl}?token=${emailConfirmationToken}&userId=${user.id}`;

            await this.usersRepository.update(
                { id: user.id },
                {
                    emailConfirmationToken,
                    emailConfirmationTokenExpiryTime: expiryTime,
                },
            );

            // Should be using a message queue (rabbitmq, kafka,...) instead of sending email directly here
            this.mailService.sendMail({
                to: user.email,
                subject: 'Please confirm your email address',
                template: 'confirm-email',
                context: {
                    username: user.name,
                    link,
                },
            });
        }
    }
}
