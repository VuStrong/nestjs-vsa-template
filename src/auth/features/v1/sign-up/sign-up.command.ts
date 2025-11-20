import { Command } from "@nestjs/cqrs";
import { SignUpResponseDto } from "./sign-up.dto";

export class SignUpCommand extends Command<SignUpResponseDto> {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
    ) {
        super();
    }
}
