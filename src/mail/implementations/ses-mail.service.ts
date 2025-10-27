import { Injectable } from "@nestjs/common";
import { MailService, SendMailPayload } from "../mail.service";

@Injectable()
export class SesMailService implements MailService {
    async sendMail(payload: SendMailPayload): Promise<void> {
        // Send mail using Amazon SES
        // Using the package: https://www.npmjs.com/package/@aws-sdk/client-sesv2
        // Using with nodemailer: https://nodemailer.com/transports/ses
    }
}