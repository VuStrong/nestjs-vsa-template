import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import {
    ResetPasswordRequestDto,
} from './reset-password.dto';
import { ResetPasswordCommand } from './reset-password.command';

@ApiTags('auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class ResetPasswordController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({ summary: 'Reset password' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    @ApiOkResponse({ description: 'Success' })
    @HttpCode(200)
    @Post('reset-password')
    async post(@Body() request: ResetPasswordRequestDto) {
        return this.commandBus.execute(
            new ResetPasswordCommand(
                request.userId,
                request.token,
                request.newPassword,
            ),
        );
    }
}
