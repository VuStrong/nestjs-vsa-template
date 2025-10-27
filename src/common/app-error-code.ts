export enum AppErrorCode {
    /**
     * Unknown errors
     */
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

    /**
     * Validation errors
     */
    VALIDATION_ERROR = 'VALIDATION_ERROR',

    /**
     * Authentication error
     */
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',

    /**
     * Errors related to resource not found (DB, ...)
     */
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
    
    /**
     * Duplicate entity error (e.g., unique constraint violation)
     */
    DUP_ENTITY_ERROR = 'DUP_ENTITY_ERROR',

    /**
     * Error when locked account trying to access system
     */
    ACCOUNT_LOCKED_OUT = 'ACCOUNT_LOCKED_OUT',

    /**
     * When login with email/password but password is not set
     */
    LOGIN_PASSWORD_NOT_SET = 'LOGIN_PASSWORD_NOT_SET',

    /**
     * Forbidden action error
     */
    FORBIDDEN_ACTION = 'FORBIDDEN_ACTION',
}
