export default () => ({
    port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
    nodeEnv: process.env.NODE_ENV ?? 'development',

    system: {
        name: process.env.SYSTEM_NAME ?? 'E-Learning',
        logoUrl: process.env.SYSTEM_LOGO_URL ?? '',
        webUrl: process.env.SYSTEM_WEB_URL ?? '',
    },

    webClientConfirmEmailUrl: process.env.WEB_CLIENT_CONFIRM_EMAIL_URL ?? '',
    webClientResetPasswordUrl: process.env.WEB_CLIENT_RESET_PASSWORD_URL ?? '',

    database: {
        url: process.env.DATABASE_URL ?? '',
    },

    jwt: {
        secret: process.env.JWT_SECRET ?? '',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    },

    smtp: {
        host: process.env.SMTP_HOST ?? '',
        port: parseInt(process.env.SMTP_PORT ?? '587', 10) || 587,
        user: process.env.SMTP_USER ?? '',
        password: process.env.SMTP_PASS ?? '',
    },
});

export interface JwtConfig {
    secret: string;
    expiresIn: string;
}

export interface SmtpConfig {
    host: string;
    port: number;
    user: string;
    password: string;
}
