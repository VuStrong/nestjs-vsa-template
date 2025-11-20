import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmEmailRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string;
}