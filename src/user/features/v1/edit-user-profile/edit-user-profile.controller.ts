import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { UserDto } from 'src/user/dtos/user.dto';
import {
    EditUserProfileRequest,
    editUserProfileRequestSchema,
} from './edit-user-profile.request';
import { EditUserProfileCommand } from './edit-user-profile.command';

@ApiBearerAuth()
@ApiTags('users')
@Controller({
    path: 'users',
    version: '1',
})
export class EditUserProfileController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOperation({ summary: 'Edit current user profile' })
    @ApiOkResponse({ type: UserDto })
    @ApiUnauthorizedResponse()
    @UseGuards(AuthGuard)
    @Patch('me')
    async patch(
        @ReqUser('sub') userId: string,
        @Body(new ZodValidationPipe(editUserProfileRequestSchema))
        request: EditUserProfileRequest,
    ) {
        const command = new EditUserProfileCommand(userId);
        command.name = request.name;

        return this.commandBus.execute(command);
    }
}
