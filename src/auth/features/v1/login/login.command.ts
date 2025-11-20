import { Command } from '@nestjs/cqrs';
import { LoginResponseDto } from './login.dto';

export class LoginCommand extends Command<LoginResponseDto> {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ) {
        super();
    }
}
