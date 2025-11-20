import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import User from 'src/data/entities/user.entity';
import RefreshToken from 'src/data/entities/refresh-token.entity';
import { LoginHandler } from './features/v1/login/login.handler';
import { LoginController } from './features/v1/login/login.controller';
import { SignUpHandler } from './features/v1/sign-up/sign-up.handler';
import { SignUpController } from './features/v1/sign-up/sign-up.controller';
import { GetNewAccessTokenController } from './features/v1/get-new-access-token/get-new-access-token.controller';
import { GetNewAccessTokenHandler } from './features/v1/get-new-access-token/get-new-access-token.handler';
import { ConfirmEmailController } from './features/v1/confirm-email/confirm-email.controller';
import { ConfirmEmailHandler } from './features/v1/confirm-email/confirm-email.handler';
import { ResendConfirmationEmailController } from './features/v1/resend-confirmation-email/resend-confirmation-email.controller';
import { ResendConfirmationEmailHandler } from './features/v1/resend-confirmation-email/resend-confirmation-email.handler';
import { ResetPasswordController } from './features/v1/reset-password/reset-password.controller';
import { ResetPasswordHandler } from './features/v1/reset-password/reset-password.handler';
import { ForgotPasswordController } from './features/v1/forgot-password/forgot-password.controller';
import { ForgotPasswordHandler } from './features/v1/forgot-password/forgot-password.handler';
import { MailModule } from 'src/mail/mail.module';
import jwtConfig from 'src/config/jwt.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, RefreshToken]),
        JwtModule.registerAsync({
            useFactory: (jwt: ConfigType<typeof jwtConfig>) => ({
                secret: jwt.secret,
                signOptions: {
                    expiresIn: jwt.expiresIn as any,
                },
            }),
            inject: [jwtConfig.KEY],
        }),
        MailModule,
    ],
    controllers: [
        LoginController,
        SignUpController,
        GetNewAccessTokenController,
        ConfirmEmailController,
        ResendConfirmationEmailController,
        ResetPasswordController,
        ForgotPasswordController,
    ],
    providers: [
        LoginHandler,
        SignUpHandler,
        GetNewAccessTokenHandler,
        ConfirmEmailHandler,
        ResendConfirmationEmailHandler,
        ResetPasswordHandler,
        ForgotPasswordHandler,
    ],
})
export class AuthModule {}
