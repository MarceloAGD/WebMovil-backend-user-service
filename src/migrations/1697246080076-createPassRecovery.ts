import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePassRecovery1697246080076 implements MigrationInterface {
    name = 'CreatePassRecovery1697246080076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "recoveryPass" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_7c19a5a5bbf80fd01bff2015e1a" UNIQUE ("recoveryPass")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_7c19a5a5bbf80fd01bff2015e1a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "recoveryPass"`);
    }

}
