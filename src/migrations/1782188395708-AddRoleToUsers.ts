import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUsers1782188395708 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN role VARCHAR NOT NULL DEFAULT 'PATIENT';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN role;
    `);
  }
}
