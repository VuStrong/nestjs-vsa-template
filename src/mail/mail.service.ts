export interface MailService {
    sendMail(payload: SendMailPayload): Promise<void>;
}

export interface SendMailPayload {
    to: string;
    from?: string;
    subject: string;

    /**
     * Plaintext body
     */
    text?: string;

    /**
     * HTML body content
     */
    html?: string;

    /**
     * Optional template name for email
     */
    template?: string;

    /**
     * Additional context for email templates
     */
    context?: Record<string, any>;
}