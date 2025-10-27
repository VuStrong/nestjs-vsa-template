import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { SignUpCommand, SignUpResponse } from './sign-up.command';
import { SignUpRequest, signUpRequestSchema } from './sign-up.request';

@ApiTags('auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class SignUpController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({ summary: 'Create new account' })
    @ApiCreatedResponse({ type: SignUpResponse })
    @Post('sign-up')
    @UsePipes(new ZodValidationPipe(signUpRequestSchema))
    async signUp(@Body() request: SignUpRequest) {
        return this.commandBus.execute(
            new SignUpCommand(request.name, request.email, request.password),
        );
    }
}
