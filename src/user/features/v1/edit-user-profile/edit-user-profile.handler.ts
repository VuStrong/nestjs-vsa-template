import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from 'src/data/entities/user.entity';
import { UserDto } from 'src/user/dto/user.dto';
import { AppException } from 'src/common/exceptions/app.exception';
import { EditUserProfileCommand } from './edit-user-profile.command';

@CommandHandler(EditUserProfileCommand)
export class EditUserProfileHandler
    implements ICommandHandler<EditUserProfileCommand>
{
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async execute(command: EditUserProfileCommand): Promise<UserDto> {
        let user = await this.usersRepository.findOne({
            where: { id: command.userId },
        });

        if (!user) {
            throw AppException.newResourceNotFoundException('User', 'id', command.userId);
        }

        if (command.name) user.name = command.name;
        // ... handle other fields similarly

        await this.usersRepository.save(user);

        return UserDto.fromUserEntity(user);
    }
}
