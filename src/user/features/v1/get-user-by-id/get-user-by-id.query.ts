import { Query } from '@nestjs/cqrs';
import { UserDto } from 'src/user/dtos/user.dto';

export class GetUserByIdQuery extends Query<UserDto> {
    /**
     * Optional fields to select (comma-separated)
     */
    public fields?: string;

    constructor(public readonly id: string) {
        super();
    }
}
