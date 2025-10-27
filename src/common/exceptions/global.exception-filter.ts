import { Response } from 'express';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { AppException } from './app.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode: number;
        let message: string;
        let errorCode: string | undefined;
        let details: any | undefined;

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            message = exception.message;
            
            if (exception instanceof AppException) {
                errorCode = exception.errorCode;
                details = exception.details;
            }
        } else {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
        }

        response.status(statusCode).json({
            statusCode,
            message,
            errorCode,
            details,
        });
    }
}
