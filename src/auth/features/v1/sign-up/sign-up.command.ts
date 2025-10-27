import { Command } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpCommand extends Command<SignUpResponse> {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
    ) {
        super();
    }
}

export class SignUpResponse {
    @ApiProperty()
    userId: string;
}