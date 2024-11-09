import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { UserSeedService } from './user/user-seed.service';
//import { VinylSeedService } from './vinyl/vinyl-seed.service';

const runSeed = async () => {
    const app = await NestFactory.create(SeedModule);

    //await app.get(UserSeedService).run();
    //await app.get(VinylSeedService).run();
    await app.get(UserSeedService).createAdmin();
    await app.close();
};

void runSeed();
