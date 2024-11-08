import { User } from 'src/user/entities/user.entity';

export type JwtPayloadType = Pick<User, 'id' | 'role' | 'email'> & {
    iat: number;
    exp: number;
};
