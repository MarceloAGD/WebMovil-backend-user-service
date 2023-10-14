import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthMigration1697248149816 implements MigrationInterface {
    name = 'AuthMigration1697248149816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recovery_password" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, CONSTRAINT "UQ_e5279407cdfe4ca36bdfb8bbda9" UNIQUE ("token"), CONSTRAINT "PK_e614931ec2e45c70f388ff75919" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_entity" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, CONSTRAINT "UQ_dac69a77647a949ee04cf0481b6" UNIQUE ("token"), CONSTRAINT "PK_d3d458da474344a6982aec36b5b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auth_entity"`);
        await queryRunner.query(`DROP TABLE "recovery_password"`);
    }

}
