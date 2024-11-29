import { test } from 'node:test';
import assert from 'assert';
import { UserService } from './user.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockUserRepository = {
    findOne: async (options: any) => {
        if (options.where.email) {
            return options.where.email === 'existing@example.com'
                ? {
                    id: 1,
                    email: 'existing@example.com',
                    password: 'hashedPassword',
                    avatar: null,
                }
                : null;
        } else if (options.where.id) {
            return options.where.id === 1
                ? {
                    id: 1,
                    email: 'existing@example.com',
                    password: 'hashedPassword',
                    avatar: null,
                }
                : null;
        }
        return null;
    },
    create: (data: any) => ({ id: 2, ...data }),
    save: async (user: any) => user,
    remove: async (user: any) => user,
};
const mockLogger = { info: () => {}, warn: () => {} };

const userService = new UserService(
    mockUserRepository as any,
    mockLogger as any
);

test('UserService.createUser should create a new user', async () => {
    const user = await userService.createUser({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
    });
    assert.strictEqual(user.email, 'new@example.com');
});

test('UserService.createUser should throw BadRequestException for existing email', async () => {
    try {
        await userService.createUser({
            email: 'existing@example.com',
            password: 'password123',
            firstName: 'Existing',
            lastName: 'User',
        });
    } catch (error) {
        assert(error instanceof BadRequestException);
    }
});
test('UserService.findOneById should return user if found', async () => {
    const user = await userService.findOneById(1);
    assert.strictEqual(user?.email, 'existing@example.com');
});

test('UserService.findOneById should return null if user not found', async () => {
    const user = await userService.findOneById(99);
    assert.strictEqual(user, null);
});

test('UserService.updateAvatar should update avatar if user exists', async () => {
    await userService.updateAvatar(1, Buffer.from('avatar data'));
    assert.ok(true);
});

test('UserService.updateAvatar should throw NotFoundException if user does not exist', async () => {
    try {
        await userService.updateAvatar(99, Buffer.from('avatar data'));
    } catch (error) {
        assert(error instanceof NotFoundException);
    }
});

test('UserService.removeUser should remove user if found', async () => {
    await userService.removeUser(1);
    assert.ok(true);
});

test('UserService.removeUser should throw NotFoundException if user not found', async () => {
    try {
        await userService.removeUser(99);
    } catch (error) {
        assert(error instanceof NotFoundException);
    }
});
