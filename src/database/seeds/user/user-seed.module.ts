import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedService } from './user-seed.service';
import { User } from '../../../user/entities/user.entity';
import { HashingService } from 'src/shared/hashing/hashing.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserSeedService,HashingService],
    exports: [UserSeedService],
})
export class UserSeedModule {}
