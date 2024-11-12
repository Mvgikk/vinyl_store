import { test } from 'node:test';
import assert from 'assert';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

const sessionId = 1;

const mockUserService = {
    findOneByEmail: async (email: string) =>
        email === 'test@example.com'
            ? { id: 1, email, password: 'hashedPassword', role: 'user' }
            : null,
    createUser: async (userData: any) => ({ ...userData, id: 2 }),
};
const mockJwtService = { sign: () => 'mockedJwtToken' };
const mockSessionService = {
    initializeSession: async () => ({ id: sessionId }),
    finalizeSession: async () => {},
    deleteSession: async () => {},
};
const mockHashingService = {
    comparePassword: async (password: string) =>
        password === 'securePassword123',
    hashPassword: async (password: string) => `hashed-${password}`,
};
const mockEventEmitter = { emit: () => {} };
const mockLogger = { info: () => {}, warn: () => {} };

const authService = new AuthService(
    mockUserService as any,
    mockJwtService as any,
    mockHashingService as any,
    mockSessionService as any,
    mockEventEmitter as any,
    mockLogger as any
);

test('AuthService.validateUser returns user for correct credentials', async () => {
    const user = await authService.validateUser(
        'test@example.com',
        'securePassword123'
    );
    assert.strictEqual(user?.email, 'test@example.com');
});

test('AuthService.validateUser returns null for incorrect credentials', async () => {
    const user = await authService.validateUser(
        'test@example.com',
        'wrongPassword'
    );
    assert.strictEqual(user, null);
});

test('AuthService.login throws UnauthorizedException for invalid login', async () => {
    try {
        await authService.login({
            email: 'wrong@example.com',
            password: 'wrongPassword',
        });
    } catch (error) {
        assert(error instanceof UnauthorizedException);
    }
});

test('AuthService.login returns JWT token for valid login', async () => {
    const result = await authService.login({
        email: 'test@example.com',
        password: 'securePassword123',
    });
    assert.strictEqual(result.access_token, 'mockedJwtToken');
});

test('AuthService.register creates and returns new user profile', async () => {
    const result = await authService.register({
        email: 'newuser@example.com',
        password: 'newPassword123',
        firstName: 'New',
        lastName: 'User',
    });
    assert.strictEqual(result.email, 'newuser@example.com');
});

test('AuthService.logout completes without errors', async () => {
    await authService.logout(sessionId);
    assert.ok(true);
});
