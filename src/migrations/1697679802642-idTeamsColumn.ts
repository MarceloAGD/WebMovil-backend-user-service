import { MigrationInterface, QueryRunner } from "typeorm";

export class IdTeamsColumn1697679802642 implements MigrationInterface {
    name = 'IdTeamsColumn1697679802642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "idTeams" integer array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "idTeams"`);
    }

}
