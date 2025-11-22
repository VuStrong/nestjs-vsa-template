export type AppErrorDescription = {
    statusCode: number;
    message: string;
    errorCode: string;
};

export class AppError {
    public static readonly INTERNAL_SERVER_ERROR: AppErrorDescription = {
        statusCode: 500,
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred on the server.',
    };

    public static readonly VALIDATION_ERROR: AppErrorDescription = {
        statusCode: 400,
        errorCode: 'VALIDATION_ERROR',
        message: 'Validation failed.',
    };

    public static readonly UNAUTHORIZED: AppErrorDescription = {
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
        message: 'Authentication required.',
    };

    public static readonly INVALID_CREDENTIALS: AppErrorDescription = {
        statusCode: 401,
        errorCode: 'INVALID_CREDENTIALS',
        message: 'Incorrect email or password.',
    };

    public static readonly FORBIDDEN_RESOURCE: AppErrorDescription = {
        statusCode: 403,
        errorCode: 'FORBIDDEN_RESOURCE',
        message: 'Access denied.',
    };

    public static readonly RESOURCE_NOT_FOUND: AppErrorDescription = {
        statusCode: 404,
        errorCode: 'RESOURCE_NOT_FOUND',
        message: 'Resource not found.',
    };

    public static readonly RESOURCE_ALREADY_EXISTED: AppErrorDescription = {
        statusCode: 409,
        errorCode: 'RESOURCE_ALREADY_EXISTED',
        message: 'Resource already existed.',
    };

    public static readonly USER_LOCKED: AppErrorDescription = {
        statusCode: 403,
        errorCode: 'USER_LOCKED',
        message: 'User account is locked.',
    };

    public static readonly LOGIN_PASSWORD_NOT_SET: AppErrorDescription = {
        statusCode: 403,
        errorCode: 'LOGIN_PASSWORD_NOT_SET',
        message: 'Your account is not registered with email and password. Try using another login method or reset your password.',
    };
 
    public static readonly TOKEN_INVALID: AppErrorDescription = {
        statusCode: 403,
        errorCode: 'TOKEN_INVALID',
        message: 'Token is invalid or has expired.',
    };
}