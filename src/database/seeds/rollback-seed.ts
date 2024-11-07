import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { UserSeedService } from './user/user-seed.service';
import { VinylSeedService } from './vinyl/vinyl-seed.service';


const rollbackSeed = async () => {
    const app = await NestFactory.create(SeedModule);

    await app.get(VinylSeedService).clear();
    await app.get(UserSeedService).clear();

    await app.close();
};

void rollbackSeed();
