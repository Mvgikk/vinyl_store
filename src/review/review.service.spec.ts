import { test } from 'node:test';
import assert from 'assert';
import { ReviewService } from './review.service';
import { NotFoundException } from '@nestjs/common';

const mockReviewRepository = {
    create: (reviewData: any) => reviewData,
    save: async (review: any) => ({ ...review, id: 1 }),
    findOne: async ({ where: { id } }: any) =>
        id === 1 ? { id, comment: 'Amazing sound!', rating: 5 } : null,
    remove: async () => {},
    findAndCount: async () => [
        [{ id: 1, comment: 'Amazing sound!', rating: 5 }],
        1,
    ],
};

const mockVinylService = {
    findOneById: async (id: number) => (id === 1 ? { id } : null),
};

const mockUserService = {
    findOneById: async (id: number) => (id === 1 ? { id } : null),
};

const mockLogger = { info: () => {} };

const reviewService = new ReviewService(
    mockReviewRepository as any,
    mockVinylService as any,
    mockUserService as any,
    mockLogger as any
);

test('ReviewService.addReview should create a review if user and vinyl exist', async () => {
    const reviewDto = { comment: 'Amazing sound!', rating: 5, vinylId: 1 };
    const result = await reviewService.addReview(reviewDto, 1);
    assert.strictEqual(result.comment, 'Amazing sound!');
    assert.strictEqual(result.rating, 5);
});

test('ReviewService.addReview should throw NotFoundException if vinyl does not exist', async () => {
    try {
        await reviewService.addReview(
            { comment: 'Amazing!', rating: 5, vinylId: 2 },
            1
        );
    } catch (error) {
        assert(error instanceof NotFoundException);
        assert.strictEqual(error.message, 'Vinyl with ID 2 not found');
    }
});

test('ReviewService.addReview should throw NotFoundException if user does not exist', async () => {
    try {
        await reviewService.addReview(
            { comment: 'Amazing!', rating: 5, vinylId: 1 },
            2
        );
    } catch (error) {
        assert(error instanceof NotFoundException);
        assert.strictEqual(error.message, 'User with ID 2 not found');
    }
});

test('ReviewService.findOneById should return a review if found', async () => {
    const review = await reviewService.findOneById(1);
    assert.strictEqual(review?.comment, 'Amazing sound!');
    assert.strictEqual(review?.rating, 5);
});

test('ReviewService.findOneById should return null if review not found', async () => {
    const review = await reviewService.findOneById(2);
    assert.strictEqual(review, null);
});

test('ReviewService.deleteReview should delete review if found', async () => {
    await reviewService.deleteReview(1);
    assert.ok(true);
});

test('ReviewService.deleteReview should throw NotFoundException if review not found', async () => {
    try {
        await reviewService.deleteReview(2);
    } catch (error) {
        assert(error instanceof NotFoundException);
        assert.strictEqual(error.message, 'Review with ID 2 not found');
    }
});

test('ReviewService.getReviewsForVinyl should return reviews if vinyl exists', async () => {
    const result = await reviewService.getReviewsForVinyl(1, {
        page: 1,
        limit: 10,
    });
    assert.strictEqual(result.total, 1);
    assert.strictEqual(result.data[0].comment, 'Amazing sound!');
    assert.strictEqual(result.data[0].rating, 5);
});

test('ReviewService.getReviewsForVinyl should throw NotFoundException if vinyl not found', async () => {
    try {
        await reviewService.getReviewsForVinyl(2, { page: 1, limit: 10 });
    } catch (error) {
        assert(error instanceof NotFoundException);
        assert.strictEqual(error.message, 'Vinyl with ID 2 not found');
    }
});
