import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TransformToTrimmedString } from 'src/common/decorators/transform.decorator';

export class EditUserProfileRequestDto {
    @ApiProperty()
    @TransformToTrimmedString()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    name?: string;
}