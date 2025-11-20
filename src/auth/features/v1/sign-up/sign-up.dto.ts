import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { TransformToTrimmedString } from 'src/common/decorators/transform.decorator';

export class SignUpRequestDto {
    @ApiProperty()
    @TransformToTrimmedString()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @TransformToTrimmedString()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    password: string;
}

export class SignUpResponseDto {
    @ApiProperty()
    userId: string;
}