import { test } from 'node:test';
import assert from 'assert';
import { AppService } from './app.service';

test('AppService should return "Hello World!"', () => {
    const service = new AppService();
    assert.strictEqual(service.getHello(), 'Hello World!');
});
