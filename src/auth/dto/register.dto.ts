import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        description: 'Email of the user',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password for the user account',
        example: 'securePassword123',
        minLength: 8,
    })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'First name of the user',
        example: 'John',
    })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: 'Last name of the user',
        example: 'Doe',
    })
    @IsNotEmpty()
    lastName: string;
}
