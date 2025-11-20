import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}