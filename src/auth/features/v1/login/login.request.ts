import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export class LoginRequest {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}

export const loginRequestSchema = z.object({
    email: z.email("Field 'email' is invalid or missing"),
    password: z
        .string("Field 'password' is not a string")
        .nonempty("Field 'password' is required"),
});
