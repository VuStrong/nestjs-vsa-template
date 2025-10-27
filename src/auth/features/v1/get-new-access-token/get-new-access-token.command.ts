import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';

export class GetNewAccessTokenCommand extends Command<GetNewAccessTokenResponse> {
    constructor(
        public readonly refreshToken: string,
        public readonly userId: string,
    ) {
        super();
    }
}

export class GetNewAccessTokenResponse {
    @ApiProperty()
    accessToken: string;
}