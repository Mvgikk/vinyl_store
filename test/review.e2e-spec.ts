process.env.NODE_ENV = 'test'; //TODO because keeps working on dev environment without it for some reason

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'assert';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { UserSeedService } from '../src/database/seeds/user/user-seed.service';
import { SeedModule } from '../src/database/seeds/seed.module';

let app: INestApplication;
let dataSource: DataSource;
let userToken: string;
let adminToken: string;
let vinylId: number;
let reviewId: number;

async function clearDatabase(dataSource: DataSource) {
    await dataSource.query('DELETE FROM "review";');
    await dataSource.query('DELETE FROM "session";');
    await dataSource.query('DELETE FROM "user";');
    await dataSource.query('DELETE FROM "vinyl";');
    await dataSource.query('ALTER SEQUENCE review_id_seq RESTART WITH 1;');
    await dataSource.query('ALTER SEQUENCE user_id_seq RESTART WITH 1;');
    await dataSource.query('ALTER SEQUENCE vinyl_id_seq RESTART WITH 1;');
    await dataSource.query('ALTER SEQUENCE session_id_seq RESTART WITH 1;');
}

beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule, SeedModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await clearDatabase(dataSource);

    const userSeedService = moduleFixture.get<UserSeedService>(UserSeedService);
    await userSeedService.createAdmin();

    const adminLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
        });
    adminToken = adminLoginResponse.body.access_token;

    await request(app.getHttpServer()).post('/auth/register').send({
        email: 'test@example.com',
        password: 'securePassword123',
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '1990-01-01',
    });
    const userLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            email: 'test@example.com',
            password: 'securePassword123',
        });
    userToken = userLoginResponse.body.access_token;

    const vinylResponse = await request(app.getHttpServer())
        .post('/vinyl')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Sample Vinyl',
            author: 'Artist',
            description: 'Description',
            price: 29.99,
        });
    vinylId = vinylResponse.body.id;
});

afterEach(async () => {
    await clearDatabase(dataSource);
    await app.close();
});

test('POST /review - add a new review', async () => {
    const response = await request(app.getHttpServer())
        .post('/review')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            vinylId,
            comment: 'Amazing album!',
            rating: 5,
        });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.comment, 'Amazing album!');
    assert.strictEqual(response.body.rating, 5);
});

test('DELETE /review/:id - delete a review (Admin only)', async () => {
    const reviewResponse = await request(app.getHttpServer())
        .post('/review')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            vinylId,
            comment: 'Good album',
            rating: 4,
        });
    reviewId = reviewResponse.body.id;

    const deleteResponse = await request(app.getHttpServer())
        .delete(`/review/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(deleteResponse.status, 200);
    assert.strictEqual(
        deleteResponse.body.message,
        'Review deleted successfully'
    );
});

test('DELETE /review/:id - regular user cannot delete review (Admin only) ', async () => {
    const reviewResponse = await request(app.getHttpServer())
        .post('/review')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            vinylId,
            comment: 'Nice vinyl!',
            rating: 4,
        });
    reviewId = reviewResponse.body.id;

    const deleteResponse = await request(app.getHttpServer())
        .delete(`/review/${reviewId}`)
        .set('Authorization', `Bearer ${userToken}`);

    assert.strictEqual(deleteResponse.status, 403);
});
