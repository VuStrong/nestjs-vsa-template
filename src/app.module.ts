import path from 'path';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        CqrsModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql',
                synchronize: false,
                logging: configService.get<string>('nodeEnv') === 'development',
                url: configService.get<string>('database.url'),
                entities: [path.join(__dirname, '/data/entities/*.entity{.ts,.js}')],
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UserModule,
    ],
})
export class AppModule {}
