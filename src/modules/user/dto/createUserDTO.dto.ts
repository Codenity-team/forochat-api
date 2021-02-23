import { Transform } from 'class-transformer';
import {
    IsEmail, IsNotEmpty, IsOptional, IsString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    identification: string;

    @ApiProperty({
        nullable: true
    })
    @IsOptional()
    phone: string | null;

    @ApiProperty({
        nullable: true
    })
    @IsOptional()
    address: string | null;
}
