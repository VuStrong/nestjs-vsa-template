import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
    GetNewAccessTokenCommand,
    GetNewAccessTokenResponse,
} from './get-new-access-token.command';
import {
    GetNewAccessTokenRequest,
    getNewAccessTokenRequestSchema,
} from './get-new-access-token.request';

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
    @ApiOkResponse({ type: GetNewAccessTokenResponse })
    @HttpCode(200)
    @Post('new-at')
    @UsePipes(new ZodValidationPipe(getNewAccessTokenRequestSchema))
    async getNewAT(@Body() request: GetNewAccessTokenRequest) {
        return this.commandBus.execute(
            new GetNewAccessTokenCommand(request.refreshToken, request.userId),
        );
    }
}
