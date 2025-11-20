import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetNewAccessTokenRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    refreshToken: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class GetNewAccessTokenResponseDto {
    @ApiProperty()
    accessToken: string;
}