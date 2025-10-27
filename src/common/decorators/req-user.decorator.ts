import { ExecutionContext, createParamDecorator } from "@nestjs/common";

/**
 * Decorator to extract authenticated user information from the request object.
 */
export const ReqUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return data ? request.user?.[data] : request.user;
    },
);