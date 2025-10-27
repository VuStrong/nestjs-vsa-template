import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import User from 'src/data/entities/user.entity';
import { GetUserByIdHandler } from './features/v1/get-user-by-id/get-user-by-id.handler';
import { GetUserByIdController } from './features/v1/get-user-by-id/get-user-by-id.controller';
import { EditUserProfileController } from './features/v1/edit-user-profile/edit-user-profile.controller';
import { EditUserProfileHandler } from './features/v1/edit-user-profile/edit-user-profile.handler';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
    controllers: [GetUserByIdController, EditUserProfileController],
    providers: [GetUserByIdHandler, EditUserProfileHandler],
})
export class UserModule {}
