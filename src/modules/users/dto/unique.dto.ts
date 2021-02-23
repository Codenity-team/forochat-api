import {
    IsEmail, IsNotEmpty, IsOptional, IsString
} from 'class-validator';

export class UserUniqueFieldsDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    identification?: string | null;
}
