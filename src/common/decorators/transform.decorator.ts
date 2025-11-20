import { Transform } from 'class-transformer';

/**
 * A custom decorator to transform string values 'true' and 'false' to boolean.
 */
export const TransformToBoolean = () =>
    Transform(({ value }) => {
        switch (value) {
            case 'true':
                return true;
            case 'false':
                return false;
            default:
                return value;
        }
    });

/**
 * A custom decorator to trim whitespace from string values.
 */
export const TransformToTrimmedString = () =>
    Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    );