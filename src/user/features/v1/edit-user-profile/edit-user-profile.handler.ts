import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';
import User from 'src/data/entities/user.entity';
import { UserDto } from 'src/user/dtos/user.dto';
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
            throw new ResourceNotFoundException('User', command.userId);
        }

        if (command.name) user.name = command.name;
        // ... handle other fields similarly

        await this.usersRepository.save(user);

        return UserDto.fromUserEntity(user);
    }
}
