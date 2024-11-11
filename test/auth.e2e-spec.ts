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

beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
});

afterEach(async () => {
    if (dataSource) {
        await dataSource.query('DELETE FROM "user";');
        await dataSource.query('ALTER SEQUENCE user_id_seq RESTART WITH 1;');
    }
    await app.close();
});

test('POST /auth/register - successful registration', async () => {
    const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
            email: 'test@example.com',
            password: 'securePassword123',
            firstName: 'John',
            lastName: 'Doe',
            birthdate: '1990-01-01',
        });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.email, 'test@example.com');
    assert.strictEqual(response.body.firstName, 'John');
    assert.strictEqual(response.body.lastName, 'Doe');
});

test('POST /auth/register - duplicate email', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
        email: 'test@example.com',
        password: 'securePassword123',
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '1990-01-01',
    });

    const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
            email: 'test@example.com',
            password: 'anotherPassword123',
            firstName: 'Jane',
            lastName: 'Doe',
            birthdate: '1990-01-01',
        });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.message, 'Email already exists');
});

test('POST /auth/login - successful login', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
        email: 'testlogin@example.com',
        password: 'securePassword123',
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '1990-01-01',
    });

    const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            email: 'testlogin@example.com',
            password: 'securePassword123',
        });

    assert.strictEqual(response.status, 200);
    assert.ok(response.body.access_token, 'Access token should be present');
});

test('POST /auth/login - incorrect password', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
        email: 'testfail@example.com',
        password: 'correctPassword123',
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '1990-01-01',
    });

    const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            email: 'testfail@example.com',
            password: 'incorrectPassword',
        });

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.message, 'Invalid email or password');
});

test('Access restricted endpoint after logout', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
        email: 'testaccess@example.com',
        password: 'securePassword123',
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '1990-01-01',
    });

    const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            email: 'testaccess@example.com',
            password: 'securePassword123',
        });

    const token = loginResponse.body.access_token;

    await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`);

    const restrictedResponse = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(restrictedResponse.status, 401);
});
