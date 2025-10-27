import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
    ResetPasswordRequest,
    resetPasswordRequestSchema,
} from './reset-password.request';
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
    @UsePipes(new ZodValidationPipe(resetPasswordRequestSchema))
    async post(@Body() request: ResetPasswordRequest) {
        return this.commandBus.execute(
            new ResetPasswordCommand(
                request.userId,
                request.token,
                request.newPassword,
            ),
        );
    }
}
