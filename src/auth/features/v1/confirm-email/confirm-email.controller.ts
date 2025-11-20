import { Controller, Get, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import {
    ConfirmEmailRequestDto,
} from './confirm-email.dto';
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
    async confirmEmail(@Query() request: ConfirmEmailRequestDto) {
        return this.commandBus.execute(
            new ConfirmEmailCommand(request.userId, request.token),
        );
    }
}
