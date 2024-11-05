import { test, beforeEach, afterEach } from 'node:test';
import assert from 'assert';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

let app: INestApplication;

beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
});

afterEach(async () => {
    await app.close();
});

test('/ (GET) should return "Hello World!"', async () => {
    const response = await request(app.getHttpServer()).get('/');
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.text, 'Hello World!');
});
