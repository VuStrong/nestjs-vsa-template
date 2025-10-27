import { Command } from '@nestjs/cqrs';

export class ConfirmEmailCommand extends Command<void> {
    constructor(
        public readonly userId: string,
        public readonly token: string,
    ) {
        super();
    }
}
