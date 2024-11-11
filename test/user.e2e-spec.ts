process.env.NODE_ENV = 'test'; //TODO because keeps working on dev environment without it for some reason

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'assert';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

let app: INestApplication;
let dataSource: DataSource;
let token: string;
let userId: number;


async function clearDatabase(dataSource: DataSource) {
    await dataSource.query('DELETE FROM "session";');
    await dataSource.query('ALTER SEQUENCE session_id_seq RESTART WITH 1;');

    await dataSource.query('DELETE FROM "user";');
    await dataSource.query('ALTER SEQUENCE user_id_seq RESTART WITH 1;');
}


beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await clearDatabase(dataSource);

    const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
            email: 'test@example.com',
            password: 'securePassword123',
            firstName: 'John',
            lastName: 'Doe',
            birthdate: '1990-01-01'
        });

    userId = registerResponse.body.id;

    const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            email: 'test@example.com',
            password: 'securePassword123'
        });

    token = loginResponse.body.access_token;
});

afterEach(async () => {
    await clearDatabase(dataSource);
    await app.close();
});

test('GET /user/profile - retrieve user profile', async () => {
    const response = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.email, 'test@example.com');
    assert.strictEqual(response.body.firstName, 'John');
    assert.strictEqual(response.body.lastName, 'Doe');
});

test('PATCH /user/profile - update user profile', async () => {
    const response = await request(app.getHttpServer())
        .patch('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
            firstName: 'Jane',
            lastName: 'Smith'
        });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.firstName, 'Jane');
    assert.strictEqual(response.body.lastName, 'Smith');
});

test('PUT /user/profile/avatar - update user avatar', async () => {
    const response = await request(app.getHttpServer())
        .put('/user/profile/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('test image content'), {
            filename: 'avatar.jpg',
            contentType: 'image/jpeg'
        });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.message, 'User avatar updated successfully');
});

test('GET /user/profile/avatar/:userId - retrieve user avatar', async () => {
    await request(app.getHttpServer())
        .put('/user/profile/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('test image content'), {
            filename: 'avatar.jpg',
            contentType: 'image/jpeg'
        });

    const response = await request(app.getHttpServer())
        .get(`/user/profile/avatar/${userId}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.headers['content-type'], 'image/jpeg');
});

test('DELETE /user/profile/avatar - delete user avatar', async () => {
    await request(app.getHttpServer())
        .put('/user/profile/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('test image content'), {
            filename: 'avatar.jpg',
            contentType: 'image/jpeg'
        });

    const deleteResponse = await request(app.getHttpServer())
        .delete('/user/profile/avatar')
        .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(deleteResponse.status, 200);
    assert.strictEqual(deleteResponse.body.message, 'Avatar deleted successfully');
});

test('DELETE /user/profile - delete user profile', async () => {
    const response = await request(app.getHttpServer())
        .delete('/user/profile')
        .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.message, 'User deleted successfully');
});
