import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    environment: process.env.NODE_ENV ?? 'development',
    name: process.env.APP_NAME ?? 'NestJS VSA',
    logoUrl: process.env.APP_LOGO_URL ?? '',
    webUrl: process.env.APP_WEB_URL ?? '',
    webClientConfirmEmailUrl: process.env.APP_WEB_CLIENT_CONFIRM_EMAIL_URL ?? '',
    webClientResetPasswordUrl: process.env.APP_WEB_CLIENT_RESET_PASSWORD_URL ?? '',
}));