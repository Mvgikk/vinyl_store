import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripeSessionTableToOrder1731246079730
implements MigrationInterface
{
    name = 'AddStripeSessionTableToOrder1731246079730';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" ADD "stripeSessionId" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" DROP COLUMN "stripeSessionId"`
        );
    }
}
