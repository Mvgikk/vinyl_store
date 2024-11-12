import { test } from 'node:test';
import assert from 'assert';
import { SessionService } from './session.service';

const mockSessionRepository = {
    create: (data: any) => data,
    save: async (session: any) => ({ ...session, id: 1 }),
    delete: async ({ id }: { id: number }) => ({ affected: id ? 1 : 0 }),
    findOne: async ({ where: { id } }: any) =>
        id === 1 ? { id, userId: 1, token: 'testToken' } : null,
    findAndCount: async () => [[], 0],
};
const mockLogger = { info: () => {} };

const sessionService = new SessionService(
    mockSessionRepository as any,
    mockLogger as any
);

test('SessionService.initializeSession creates a session', async () => {
    const session = await sessionService.initializeSession(1);
    assert.strictEqual(session.userId, 1);
    assert.strictEqual(session.token, '');
});

test('SessionService.finalizeSession updates session with token', async () => {
    const session = await sessionService.finalizeSession(
        { id: 1, userId: 1, token: '' } as any,
        'newToken'
    );
    assert.strictEqual(session.token, 'newToken');
});

test('SessionService.deleteSession deletes a session by ID', async () => {
    const deleteResult = await sessionService.deleteSession(1);
    assert.strictEqual(deleteResult, undefined);
});

test('SessionService.findOneById returns session if found', async () => {
    const session = await sessionService.findOneById(1);
    assert.strictEqual(session?.id, 1);
    assert.strictEqual(session?.userId, 1);
});

test('SessionService.findOneById returns null if not found', async () => {
    const session = await sessionService.findOneById(999);
    assert.strictEqual(session, null);
});

test('SessionService.validateSession returns true for existing session', async () => {
    const isValid = await sessionService.validateSession(1);
    assert.strictEqual(isValid, true);
});

test('SessionService.validateSession returns false for non-existing session', async () => {
    const isValid = await sessionService.validateSession(999);
    assert.strictEqual(isValid, false);
});
