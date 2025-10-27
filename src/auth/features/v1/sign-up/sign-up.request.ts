import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export class SignUpRequest {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}

export const signUpRequestSchema = z.object({
    name: z
        .string("Field 'name' is not a string")
        .trim()
        .min(1, "Field 'name' is required")
        .max(30, "Field 'name' must be at most 30 characters long"),
    email: z.email("Field 'email' is invalid or missing"),
    password: z
        .string("Field 'password' is not a string")
        .trim()
        .min(8, "Field 'password' must be between 8 and 100 characters long")
        .max(100, "Field 'password' must be between 8 and 100 characters long"),
});
