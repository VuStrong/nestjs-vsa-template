import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid'

import { AppException } from 'src/common/exceptions/app.exception';
import { AppErrorCode } from 'src/common/app-error-code';
import User from 'src/data/entities/user.entity';
import { SignUpCommand } from './sign-up.command';
import { SignUpResponseDto } from './sign-up.dto';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async execute(command: SignUpCommand): Promise<SignUpResponseDto> {
        const hashedPassword = await bcrypt.hash(command.password, 10);

        const user = this.usersRepository.create({
            id: this.generateId(),
            name: command.name,
            email: command.email,
            hashedPassword,
        });

        try {
            await this.usersRepository.insert(user);

            return {
                userId: user.id,
            };
        } catch (error) {
            if (
                error instanceof QueryFailedError &&
                error.driverError.code === 'ER_DUP_ENTRY'
            ) {
                throw new AppException(
                    `Email ${command.email} already exists`,
                    400,
                    AppErrorCode.DUP_ENTITY_ERROR,
                );
            }

            throw error;
        }
    }

    private generateId(): string {
        const nanoid = customAlphabet('1234567890abcdef', 15)
        return nanoid();
    }
}
