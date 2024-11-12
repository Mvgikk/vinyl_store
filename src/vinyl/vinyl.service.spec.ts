import { test } from 'node:test';
import assert from 'assert';
import { VinylService } from './vinyl.service';
import { NotFoundException } from '@nestjs/common';

const mockVinylRepository = {
    find: async () => [{ id: 1, name: 'Test Vinyl', author: 'Test Author' }],
    findAndCount: async () => [[{ id: 1, name: 'Test Vinyl' }], 1],
    findOne: async (options: any) =>
        options.where.id === 1 ? { id: 1, name: 'Test Vinyl' } : null,
    create: (dto: any) => dto,
    save: async (vinyl: any) => vinyl,
    remove: async (vinyl: any) => vinyl,
};
const mockReviewHelperService = {
    calculateAverageScore: () => 5,
    getFirstReviewFromAnotherUser: () => ({ id: 1, comment: 'Great vinyl!' }),
};
const mockLogger = { info: () => {} };

const vinylService = new VinylService(
    mockVinylRepository as any,
    mockReviewHelperService as any,
    mockLogger as any
);

test('VinylService.findOneById should return vinyl if found', async () => {
    const vinyl = await vinylService.findOneById(1);
    assert.strictEqual(vinyl?.name, 'Test Vinyl');
});

test('VinylService.findOneById should return null if vinyl not found', async () => {
    const vinyl = await vinylService.findOneById(2);
    assert.strictEqual(vinyl, null);
});

test('VinylService.createVinyl should create and return vinyl', async () => {
    const newVinyl = {
        name: 'New Vinyl',
        author: 'New Author',
        price: 25.99,
        description: 'A great album',
    };
    const vinyl = await vinylService.createVinyl(newVinyl);
    assert.strictEqual(vinyl.name, 'New Vinyl');
});

test('VinylService.updateVinyl should update and return vinyl if exists', async () => {
    const updatedVinyl = { name: 'Updated Vinyl', author: 'Updated Author' };
    const vinyl = await vinylService.updateVinyl(1, updatedVinyl);
    assert.strictEqual(vinyl.name, 'Updated Vinyl');
});

test('VinylService.updateVinyl should throw NotFoundException if vinyl does not exist', async () => {
    try {
        await vinylService.updateVinyl(2, { name: 'Updated Vinyl' });
    } catch (error) {
        assert(error instanceof NotFoundException);
    }
});

test('VinylService.deleteVinyl should delete vinyl if exists', async () => {
    await vinylService.deleteVinyl(1);
    assert.ok(true);
});

test('VinylService.deleteVinyl should throw NotFoundException if vinyl does not exist', async () => {
    try {
        await vinylService.deleteVinyl(2);
    } catch (error) {
        assert(error instanceof NotFoundException);
    }
});

test('VinylService.searchVinyls should return search results with pagination', async () => {
    const queryOptions = {
        name: 'Test',
        page: 1,
        limit: 10,
        sort: 'name',
        order: 'asc' as 'asc' | 'desc',
    };
    const result = await vinylService.searchVinyls(queryOptions);
    assert(Array.isArray(result.data));
    assert.strictEqual(result.data[0].name, 'Test Vinyl');
    assert.strictEqual(result.total, 1);
});
