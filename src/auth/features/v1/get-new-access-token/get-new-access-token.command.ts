import { Command } from '@nestjs/cqrs';
import { GetNewAccessTokenResponseDto } from './get-new-access-token.dto';

export class GetNewAccessTokenCommand extends Command<GetNewAccessTokenResponseDto> {
    constructor(
        public readonly refreshToken: string,
        public readonly userId: string,
    ) {
        super();
    }
}