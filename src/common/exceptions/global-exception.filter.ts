import { Response } from 'express';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { AppException } from './app.exception';
import { HttpErrorResponseDto } from '../dto/http-error-response.dto';
import { AppError } from '../app.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const errorResponse: Partial<HttpErrorResponseDto> = {};

        if (exception instanceof AppException) {
            errorResponse.message = exception.message;
            errorResponse.statusCode = exception.statusCode;
            errorResponse.errorCode = exception.errorCode;
            errorResponse.details = exception.details;
        }
        else if (exception instanceof HttpException) {
            errorResponse.message = exception.message;
            errorResponse.statusCode = exception.getStatus();
        } else {
            errorResponse.message = AppError.INTERNAL_SERVER_ERROR.message;
            errorResponse.statusCode = AppError.INTERNAL_SERVER_ERROR.statusCode;
            errorResponse.errorCode = AppError.INTERNAL_SERVER_ERROR.errorCode;
        }

        response.status(errorResponse.statusCode).json(errorResponse);
    }
}