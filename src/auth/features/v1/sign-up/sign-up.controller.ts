import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SignUpCommand } from './sign-up.command';
import { SignUpRequestDto, SignUpResponseDto } from './sign-up.dto';

@ApiTags('auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class SignUpController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({ summary: 'Create new account' })
    @ApiCreatedResponse({ type: SignUpResponseDto })
    @Post('sign-up')
    async signUp(@Body() request: SignUpRequestDto) {
        return this.commandBus.execute(
            new SignUpCommand(request.name, request.email, request.password),
        );
    }
}
