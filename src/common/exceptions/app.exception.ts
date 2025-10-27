import { HttpException } from '@nestjs/common';

export class AppException extends HttpException {
    constructor(
        message: string,
        statusCode: number,
        public readonly errorCode?: string,
        public readonly details?: any,
    ) {
        super(
            {
                message,
                errorCode,
                details,
            },
            statusCode,
        );
    }
}
