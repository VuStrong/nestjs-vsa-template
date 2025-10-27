import { Controller, HttpCode, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResendConfirmationEmailCommand } from './resend-confirmation-email.command';

@ApiTags('auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class ResendConfirmationEmailController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({ summary: 'Resend confirmation email' })
    @ApiOkResponse({ description: 'Success' })
    @HttpCode(200)
    @Post('resend-confirmation-email')
    async resend(@Query('email') email: string) {
        return this.commandBus.execute(
            new ResendConfirmationEmailCommand(email),
        );
    }
}
