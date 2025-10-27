import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
    ConfirmEmailRequest,
    confirmEmailRequestSchema,
} from './confirm-email.request';
import { ConfirmEmailCommand } from './confirm-email.command';

@ApiTags('auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class ConfirmEmailController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({ summary: 'Confirm email' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    @ApiOkResponse({ description: 'Success' })
    @Get('confirm-email')
    @UsePipes(new ZodValidationPipe(confirmEmailRequestSchema))
    async confirmEmail(@Query() request: ConfirmEmailRequest) {
        return this.commandBus.execute(
            new ConfirmEmailCommand(request.userId, request.token),
        );
    }
}
