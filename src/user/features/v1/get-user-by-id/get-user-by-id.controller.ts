import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { UserDto } from 'src/user/dtos/user.dto';
import { GetUserByIdQuery } from './get-user-by-id.query';

@ApiBearerAuth()
@ApiTags('users')
@Controller({
    path: 'users',
    version: '1',
})
export class GetUserByIdController {
    constructor(private readonly queryBus: QueryBus) {}

    @ApiOperation({ summary: 'Get current user' })
    @ApiQuery({
        name: 'fields',
        required: false,
        description: 'Optional fields to select (comma-separated)',
    })
    @ApiOkResponse({ type: UserDto })
    @ApiUnauthorizedResponse()
    @UseGuards(AuthGuard)
    @Get('me')
    async getMe(
        @ReqUser('sub') userId: string,
        @Query('fields') fields?: string,
    ) {
        const query = new GetUserByIdQuery(userId);
        query.fields = fields;

        return this.queryBus.execute(query);
    }
}
