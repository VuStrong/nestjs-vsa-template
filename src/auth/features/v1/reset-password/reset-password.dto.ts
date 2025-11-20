import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { TransformToTrimmedString } from 'src/common/decorators/transform.decorator';

export class ResetPasswordRequestDto {
    @ApiProperty()
    @TransformToTrimmedString()
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @TransformToTrimmedString()
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty()
    @TransformToTrimmedString()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    newPassword: string;
}