import path from 'path';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import smtpConfig from './config/smtp.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [appConfig, databaseConfig, jwtConfig, smtpConfig],
        }),
        CqrsModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useFactory: (
                db: ConfigType<typeof databaseConfig>,
                app: ConfigType<typeof appConfig>,
            ) => ({
                type: 'mysql',
                synchronize: false,
                logging: app.environment === 'development',
                url: db.url,
                entities: [
                    path.join(__dirname, '/data/entities/*.entity{.ts,.js}'),
                ],
            }),
            inject: [databaseConfig.KEY, appConfig.KEY],
        }),
        AuthModule,
        UserModule,
    ],
})
export class AppModule {}
