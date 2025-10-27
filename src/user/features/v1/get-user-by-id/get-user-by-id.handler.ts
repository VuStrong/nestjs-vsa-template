import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityPropertyNotFoundError, Repository } from 'typeorm';

import { ValidationException } from 'src/common/exceptions/validation.exception';
import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';
import User from 'src/data/entities/user.entity';
import { UserDto } from 'src/user/dtos/user.dto';
import { GetUserByIdQuery } from './get-user-by-id.query';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async execute(query: GetUserByIdQuery): Promise<UserDto> {
        if (!query.id) {
            throw new ValidationException('User ID is missing');
        }

        const fieldsToSelect = query.fields?.split(',') as any[];
        let user: User | null;

        try {
            user = await this.usersRepository.findOne({
                where: { id: query.id },
                select: fieldsToSelect,
            });
        } catch (error) {
            if (error instanceof EntityPropertyNotFoundError) {
                throw new ValidationException(error.message);
            }

            throw error;
        }

        if (!user) {
            throw new ResourceNotFoundException('User', query.id);
        }

        return UserDto.fromUserEntity(user);
    }
}
