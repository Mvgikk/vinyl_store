import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeDelete1730929878471 implements MigrationInterface {
    name = 'AddCascadeDelete1730929878471';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`
        );
        await queryRunner.query(
            `ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`
        );
        await queryRunner.query(
            `ALTER TABLE "review" DROP CONSTRAINT "FK_01a98f7acabc7f7ba6d9025bb85"`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "review" ADD CONSTRAINT "FK_01a98f7acabc7f7ba6d9025bb85" FOREIGN KEY ("vinylId") REFERENCES "vinyl"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "review" DROP CONSTRAINT "FK_01a98f7acabc7f7ba6d9025bb85"`
        );
        await queryRunner.query(
            `ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`
        );
        await queryRunner.query(
            `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`
        );
        await queryRunner.query(
            `ALTER TABLE "review" ADD CONSTRAINT "FK_01a98f7acabc7f7ba6d9025bb85" FOREIGN KEY ("vinylId") REFERENCES "vinyl"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }
}
