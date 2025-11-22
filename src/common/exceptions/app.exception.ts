import { AppError, AppErrorDescription } from '../app.error';

export class AppException extends Error {
    readonly statusCode: number;
    readonly errorCode: string;
    readonly details?: any;

    constructor(error: AppErrorDescription, details?: any) {
        super(error.message);

        this.statusCode = error.statusCode;
        this.errorCode = error.errorCode;
        this.details = details;
    }

    static newResourceNotFoundException(
        resource: string,
        field: string,
        value: string,
    ): AppException {
        return new AppException({
            ...AppError.RESOURCE_NOT_FOUND,
            message: `${resource} with ${field} '${value}' not found`,
        });
    }

    static newResourceAlreadyExistedException(
        resource: string,
        field: string,
        value: string,
    ): AppException {
        return new AppException({
            ...AppError.RESOURCE_ALREADY_EXISTED,
            message: `${resource} with ${field} '${value}' already existed`,
        });
    }
}