import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';

export class LoginCommand extends Command<LoginResponse> {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ) {
        super();
    }
}

export class LoginResponse {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}
