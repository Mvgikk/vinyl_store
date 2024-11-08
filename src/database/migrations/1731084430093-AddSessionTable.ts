import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessionTable1731084430093 implements MigrationInterface {
    name = 'AddSessionTable1731084430093';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "session" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "session"`);
    }
}
