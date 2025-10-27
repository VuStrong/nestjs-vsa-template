import { HttpStatus } from "@nestjs/common";
import { AppException } from "./app.exception";
import { AppErrorCode } from "../app-error-code";

export class ResourceNotFoundException extends AppException {
    constructor(resourceType: string, identifier: string | number) {
        super(
            `${resourceType} with identifier ${identifier} not found`,
            HttpStatus.NOT_FOUND,
            AppErrorCode.RESOURCE_NOT_FOUND,
        );
    }
}
