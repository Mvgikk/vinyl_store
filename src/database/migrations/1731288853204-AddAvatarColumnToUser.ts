import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarColumnToUser1731288853204 implements MigrationInterface {
    name = 'AddAvatarColumnToUser1731288853204';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" RENAME COLUMN "avatarUrl" TO "avatar"`
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD "avatar" character varying`
        );
        await queryRunner.query(
            `ALTER TABLE "user" RENAME COLUMN "avatar" TO "avatarUrl"`
        );
    }
}
