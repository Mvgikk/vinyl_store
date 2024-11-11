process.env.NODE_ENV = 'test'; //TODO because keeps working on dev environment without it for some reason

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'assert';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { UserSeedService } from '../src/database/seeds/user/user-seed.service';
import { VinylSeedService } from '../src/database/seeds/vinyl/vinyl-seed.service';
import { SeedModule } from '../src/database/seeds/seed.module';

let app: INestApplication;
let dataSource: DataSource;
let adminToken: string;
let userToken: string;
let vinylId: string;

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

    const vinylSeedService =
        moduleFixture.get<VinylSeedService>(VinylSeedService);
    await vinylSeedService.run();

    const adminLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
        });
    adminToken = adminLoginResponse.body.access_token;

    await request(app.getHttpServer()).post('/auth/register').send({
        email: 'test@example.com',
        password: 'userPassword123',
        firstName: 'Regular',
        lastName: 'User',
        birthdate: '1995-05-05',
    });

    const userLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            email: 'test@example.com',
            password: 'userPassword123',
        });
    userToken = userLoginResponse.body.access_token;

    const vinylResponse = await request(app.getHttpServer())
        .post('/vinyl')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Reviewable Vinyl',
            author: 'Artist',
            description: 'Description',
            price: 19.99,
        });
    vinylId = vinylResponse.body.id;
});

afterEach(async () => {
    await clearDatabase(dataSource);
    await app.close();
});

test('GET /vinyl - retrieve paginated list of vinyls', async () => {
    const response = await request(app.getHttpServer())
        .get('/vinyl')
        .query({ page: 1, limit: 10 });

    assert.strictEqual(response.status, 200);
    assert(Array.isArray(response.body.data));
    assert.strictEqual(response.body.data.length, 10);
    assert(response.body.total >= 50);
});

test('POST /vinyl - create new vinyl (Admin only)', async () => {
    const response = await request(app.getHttpServer())
        .post('/vinyl')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Sample Vinyl',
            author: 'Artist',
            description: 'Description',
            price: 29.99,
        });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.name, 'Sample Vinyl');
});

test('PATCH /vinyl/:id - update vinyl by ID (Admin only)', async () => {
    const createResponse = await request(app.getHttpServer())
        .post('/vinyl')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Vinyl to Update',
            author: 'Original Artist',
            description: 'Original description',
            price: 19.99,
        });
    const vinylToUpdateId = createResponse.body.id;

    const response = await request(app.getHttpServer())
        .patch(`/vinyl/${vinylToUpdateId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Updated Vinyl Name',
            author: 'Updated Artist',
            description: 'Updated description',
            price: 24.99,
        });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.name, 'Updated Vinyl Name');
});

test('DELETE /vinyl/:id - delete vinyl by ID (Admin only)', async () => {
    const createResponse = await request(app.getHttpServer())
        .post('/vinyl')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Vinyl to Delete',
            author: 'Artist',
            description: 'Description',
            price: 15.99,
        });
    const vinylToDeleteId = createResponse.body.id;

    const response = await request(app.getHttpServer())
        .delete(`/vinyl/${vinylToDeleteId}`)
        .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(
        response.body.message,
        'Vinyl record deleted successfully'
    );
});

test('GET /vinyl/search - search vinyl records', async () => {
    await request(app.getHttpServer())
        .post('/vinyl')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Searchable Vinyl',
            author: 'Artist',
            description: 'Description',
            price: 45.99,
        });

    const response = await request(app.getHttpServer())
        .get('/vinyl/search')
        .query({ name: 'Searchable', page: 1, limit: 10 });

    assert.strictEqual(response.status, 200);
    assert(Array.isArray(response.body.data));
    assert(
        response.body.data.some(
            (vinyl: any) => vinyl.name === 'Searchable Vinyl'
        )
    );
});

test('POST /vinyl - regular user cannot create vinyl (Admin only)', async () => {
    const response = await request(app.getHttpServer())
        .post('/vinyl')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            name: 'Unauthorized Vinyl',
            author: 'Artist',
            description: 'Description',
            price: 29.99,
        });

    assert.strictEqual(response.status, 403);
});

test('PATCH /vinyl/:id - regular user cannot update vinyl (Admin only)', async () => {
    const createResponse = await request(app.getHttpServer())
        .post('/vinyl')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Vinyl for Admin Update',
            author: 'Artist',
            description: 'Description',
            price: 19.99,
        });
    const vinylToUpdateId = createResponse.body.id;

    const response = await request(app.getHttpServer())
        .patch(`/vinyl/${vinylToUpdateId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            name: 'Unauthorized Update Attempt',
            author: 'Artist',
            description: 'Description',
            price: 24.99,
        });

    assert.strictEqual(response.status, 403);
});

test('DELETE /vinyl/:id - regular user cannot delete vinyl (Admin only)', async () => {
    const createResponse = await request(app.getHttpServer())
        .post('/vinyl')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Vinyl to be Protected',
            author: 'Artist',
            description: 'Description',
            price: 15.99,
        });
    const vinylToDeleteId = createResponse.body.id;

    const response = await request(app.getHttpServer())
        .delete(`/vinyl/${vinylToDeleteId}`)
        .set('Authorization', `Bearer ${userToken}`);

    assert.strictEqual(response.status, 403);
});

test('GET /vinyl/:vinylId/reviews - retrieve paginated reviews for vinyl', async () => {
    await request(app.getHttpServer())
        .post('/review')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            vinylId,
            comment: 'First review',
            rating: 4,
        });
    await request(app.getHttpServer())
        .post('/review')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            vinylId,
            comment: 'Second review',
            rating: 3,
        });

    const response = await request(app.getHttpServer())
        .get(`/vinyl/${vinylId}/reviews`)
        .query({ page: 1, limit: 10 });

    assert.strictEqual(response.status, 200);
    assert(Array.isArray(response.body.data));
    assert.strictEqual(response.body.data.length, 2);
});
