import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ZodType } from 'zod';
import { ValidationException } from 'src/common/exceptions/validation.exception';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) {}

    transform(value: unknown, metadata: ArgumentMetadata) {
        const result = this.schema.safeParse(value);

        if (!result.success) {
            const errorMessages = result.error.issues.map(
                (issue) => issue.message,
            );

            throw new ValidationException('Validation failed', errorMessages);
        }

        return result.data;
    }
}
