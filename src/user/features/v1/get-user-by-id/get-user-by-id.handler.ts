import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityPropertyNotFoundError, Repository } from 'typeorm';

import User from 'src/data/entities/user.entity';
import { UserDto } from 'src/user/dto/user.dto';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { AppException } from 'src/common/exceptions/app.exception';
import { AppError } from 'src/common/app.error';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async execute(query: GetUserByIdQuery): Promise<UserDto> {
        if (!query.id) {
            throw new AppException({
                ...AppError.VALIDATION_ERROR,
                message: 'User ID is missing',
            });
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
                throw new AppException({
                    ...AppError.VALIDATION_ERROR,
                    message: error.message,
                });
            }

            throw error;
        }

        if (!user) {
            throw AppException.newResourceNotFoundException('User', 'id', query.id);
        }

        return UserDto.fromUserEntity(user);
    }
}
