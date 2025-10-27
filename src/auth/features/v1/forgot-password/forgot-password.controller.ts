import { Controller, HttpCode, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordCommand } from './forgot-password.command';

@ApiTags('auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class ForgotPasswordController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({ summary: 'Send password reset email' })
    @ApiOkResponse({ description: 'Success' })
    @HttpCode(200)
    @Post('forgot-password')
    async post(@Query('email') email: string) {
        return this.commandBus.execute(
            new ForgotPasswordCommand(email),
        );
    }
}
