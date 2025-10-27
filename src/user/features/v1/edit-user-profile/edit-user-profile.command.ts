import { Command } from '@nestjs/cqrs';
import { UserDto } from 'src/user/dtos/user.dto';

export class EditUserProfileCommand extends Command<UserDto> {
    public name?: string;

    constructor(public readonly userId: string) {
        super();
    }
}
