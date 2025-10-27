import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export class EditUserProfileRequest {
    @ApiProperty()
    name?: string;
}

export const editUserProfileRequestSchema = z.object({
    name: z
        .string("Field 'name' is not a string")
        .trim()
        .min(1, "Field 'name' must not empty and have at most 30 characters long")
        .max(30, "Field 'name' must not empty and have at most 30 characters long")
        .optional(),
});
