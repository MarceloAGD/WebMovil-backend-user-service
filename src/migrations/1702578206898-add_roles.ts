import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoles1702578206898 implements MigrationInterface {
    name = 'AddRoles1702578206898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "idTeams" TO "role"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" integer array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "role" TO "idTeams"`);
    }

}
