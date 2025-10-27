import { ApiProperty } from "@nestjs/swagger";
import User from "src/data/entities/user.entity";

export class UserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ format: 'date-time' })
    createdAt: string;

    @ApiProperty()
    emailConfirmed: boolean;

    static fromUserEntity(user: User): UserDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt?.toISOString(),
            emailConfirmed: user.emailConfirmed,
        };
    }
}