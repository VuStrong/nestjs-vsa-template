import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import fs from "fs";
import { render } from "ejs";
import juice from "juice";

import { SmtpConfig } from 'src/config/configuration';
import { MailService, SendMailPayload } from '../mail.service';

@Injectable()
export class SmtpMailService implements MailService {
    private readonly transport: Transporter;

    private readonly smtpConfig: SmtpConfig;
    private readonly systemName: string;
    private readonly systemLogoUrl: string;
    private readonly systemWebUrl: string;

    constructor(configService: ConfigService) {
        this.systemName = configService.get<string>('system.name') ?? '';
        this.systemLogoUrl = configService.get<string>('system.logoUrl') ?? '';
        this.systemWebUrl = configService.get<string>('system.webUrl') ?? '';

        const smtpConfig = configService.get<SmtpConfig>('smtp');
        if (!smtpConfig) {
            throw new Error('SMTP configuration is missing');
        }

        this.smtpConfig = smtpConfig;
        this.transport = createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: false,
            auth: {
                user: smtpConfig.user,
                pass: smtpConfig.password,
            },
        });
    }

    async sendMail(payload: SendMailPayload): Promise<void> {
        // Assign some default values
        payload.context ??= {};
        payload.context.systemName = this.systemName;
        payload.context.systemLogoUrl = this.systemLogoUrl;
        payload.context.systemWebUrl = this.systemWebUrl;

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
            from: payload.from ?? this.smtpConfig.user,
            to: payload.to,
            html,
            text,
            subject: payload.subject,
        });
    }
}
