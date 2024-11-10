import { User } from '../../user/entities/user.entity';

export type JwtPayloadType = Pick<User, 'id' | 'role' | 'email'> & {
    iat: number;
    exp: number;
    sessionId: number;
};
