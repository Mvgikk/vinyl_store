import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsDateString()
    birthdate?: string;

    @IsOptional()
    avatarUrl?: string;
}
