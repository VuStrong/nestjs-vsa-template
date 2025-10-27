import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export class ConfirmEmailRequest {
    @ApiProperty()
    token: string;

    @ApiProperty()
    userId: string;
}

export const confirmEmailRequestSchema = z.object({
    token: z.string().nonempty(),
    userId: z.string().nonempty(),
});