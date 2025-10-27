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
import { LoginCommand, LoginResponse } from './login.command';
import { LoginRequest, loginRequestSchema } from './login.request';

@ApiTags('auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class LoginController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({ summary: 'Login with email and password' })
    @ApiUnauthorizedResponse({ description: 'Email or password is incorrect' })
    @ApiForbiddenResponse({ description: 'You are locked out' })
    @ApiOkResponse({ type: LoginResponse })
    @HttpCode(200)
    @Post('login')
    @UsePipes(new ZodValidationPipe(loginRequestSchema))
    async login(@Body() request: LoginRequest) {
        return this.commandBus.execute(
            new LoginCommand(request.email, request.password),
        );
    }
}
