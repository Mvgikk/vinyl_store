import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageToVinyl1731171885186 implements MigrationInterface {
    name = 'AddImageToVinyl1731171885186';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "vinyl" ADD "image" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vinyl" DROP COLUMN "image"`);
    }
}
