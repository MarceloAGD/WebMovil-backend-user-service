import { MigrationInterface, QueryRunner } from "typeorm";

export class DeletingIdTeamsListinUserTable1699732376794 implements MigrationInterface {
    name = 'DeletingIdTeamsListinUserTable1699732376794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recovery_password" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, CONSTRAINT "UQ_e5279407cdfe4ca36bdfb8bbda9" UNIQUE ("token"), CONSTRAINT "PK_e614931ec2e45c70f388ff75919" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_entity" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, CONSTRAINT "UQ_dac69a77647a949ee04cf0481b6" UNIQUE ("token"), CONSTRAINT "PK_d3d458da474344a6982aec36b5b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auth_entity"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "recovery_password"`);
    }

}
