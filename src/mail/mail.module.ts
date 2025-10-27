import { Module } from "@nestjs/common";
import { MAIL_SERVICE } from "./mail.di-tokens";
import { SmtpMailService } from "./implementations/smtp-mail.service";

@Module({
    providers: [
        {
            provide: MAIL_SERVICE,
            // Change the implementation here to switch mail services
            useClass: SmtpMailService,
            // useClass: SesMailService,
        }
    ],
    exports: [MAIL_SERVICE],
})
export class MailModule {}