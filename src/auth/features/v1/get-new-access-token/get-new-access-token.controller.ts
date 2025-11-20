import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
    GetNewAccessTokenCommand,
} from './get-new-access-token.command';
import {
    GetNewAccessTokenRequestDto,
    GetNewAccessTokenResponseDto
} from './get-new-access-token.dto';

@ApiTags('auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class GetNewAccessTokenController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({ summary: 'Get new access token' })
    @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
    @ApiForbiddenResponse({ description: 'You are locked out' })
    @ApiOkResponse({ type: GetNewAccessTokenResponseDto })
    @HttpCode(200)
    @Post('new-at')
    async getNewAT(@Body() request: GetNewAccessTokenRequestDto) {
        return this.commandBus.execute(
            new GetNewAccessTokenCommand(request.refreshToken, request.userId),
        );
    }
}
