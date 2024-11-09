import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserProfileResponseDto {
    @Expose()
    email: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    birthdate: string;

    @Expose()
    avatarUrl: string | null;
}
