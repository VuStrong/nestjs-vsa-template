import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export class ResetPasswordRequest {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    token: string;

    @ApiProperty()
    newPassword: string;
}

export const resetPasswordRequestSchema = z.object({
    userId: z
        .string("Field 'userId' is not a string")
        .trim()
        .nonempty("Field 'userId' is empty"),
    token: z
        .string("Field 'token' is not a string")
        .trim()
        .nonempty("Field 'token' is empty"),
    newPassword: z
        .string("Field 'newPassword' is not a string")
        .trim()
        .min(8, "Field 'newPassword' must be between 8 and 100 characters long")
        .max(
            100,
            "Field 'newPassword' must be between 8 and 100 characters long",
        ),
});
