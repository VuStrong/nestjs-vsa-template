import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export class GetNewAccessTokenRequest {
    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    userId: string;
}

export const getNewAccessTokenRequestSchema = z.object({
    refreshToken: z.string().nonempty(),
    userId: z.string().nonempty(),
});