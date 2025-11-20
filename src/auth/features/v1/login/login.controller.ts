import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginCommand } from './login.command';
import { LoginRequestDto, LoginResponseDto } from './login.dto';

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
    @ApiOkResponse({ type: LoginResponseDto })
    @HttpCode(200)
    @Post('login')
    async login(@Body() request: LoginRequestDto) {
        return this.commandBus.execute(
            new LoginCommand(request.email, request.password),
        );
    }
}
