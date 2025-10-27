import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { AppErrorCode } from '../app-error-code';

export class ValidationException extends AppException {
    constructor(message: string, details?: any) {
        super(
            message,
            HttpStatus.BAD_REQUEST,
            AppErrorCode.VALIDATION_ERROR,
            details,
        );
    }
}
