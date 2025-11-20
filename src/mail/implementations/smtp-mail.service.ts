import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import fs from 'fs';
import { render } from 'ejs';
import juice from 'juice';

import smtpConfig from 'src/config/smtp.config';
import appConfig from 'src/config/app.config';
import { MailService, SendMailPayload } from '../mail.service';

@Injectable()
export class SmtpMailService implements MailService {
    private readonly transport: Transporter;

    private readonly smtpConfiguration: ConfigType<typeof smtpConfig>;
    private readonly appConfiguration: ConfigType<typeof appConfig>;

    constructor(
        @Inject(smtpConfig.KEY)
        smtpConfiguration: ConfigType<typeof smtpConfig>,
        @Inject(appConfig.KEY)
        appConfiguration: ConfigType<typeof appConfig>,
    ) {
        this.appConfiguration = appConfiguration;
        this.smtpConfiguration = smtpConfiguration;
        this.transport = createTransport({
            host: smtpConfiguration.host,
            port: smtpConfiguration.port,
            secure: false,
            auth: {
                user: smtpConfiguration.user,
                pass: smtpConfiguration.password,
            },
        });
    }

    async sendMail(payload: SendMailPayload): Promise<void> {
        // Assign some default values
        payload.context ??= {};
        payload.context.appName = this.appConfiguration.name;
        payload.context.appLogoUrl = this.appConfiguration.logoUrl;
        payload.context.appWebUrl = this.appConfiguration.webUrl;

        let html: string | undefined;
        let text: string | undefined;

        // Generate email content from template if provided
        if (payload.template) {
            const templatePath = `email-templates/${payload.template}.ejs`;

            if (fs.existsSync(templatePath)) {
                const template = fs.readFileSync(templatePath, 'utf-8');
                html = juice(render(template, payload.context));
            } else {
                throw new Error(`Template ${payload.template} not found`);
            }
        } else {
            html = payload.html;
            text = payload.text;
        }

        await this.transport.sendMail({
            from: payload.from ?? this.smtpConfiguration.user,
            to: payload.to,
            html,
            text,
            subject: payload.subject,
        });
    }
}