import { ApiProperty } from "@nestjs/swagger";

export class HttpErrorResponseDto {
    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    message: string;

    @ApiProperty()
    errorCode?: string;

    @ApiProperty()
    details?: any;
}