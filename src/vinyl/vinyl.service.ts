import { Injectable } from '@nestjs/common';

@Injectable()
export class VinylService {
    create() {
        return 'This action adds a new vinyl';
    }

    findAll() {
        return 'This action returns all vinyl';
    }

    findOne(id: number) {
        return `This action returns a #${id} vinyl`;
    }

    update(id: number) {
        return `This action updates a #${id} vinyl`;
    }

    remove(id: number) {
        return `This action removes a #${id} vinyl`;
    }
}
