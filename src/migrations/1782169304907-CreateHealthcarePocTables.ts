import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHealthcarePocTables1710000000000 implements MigrationInterface {
  name = "CreateHealthcarePocTables1710000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
      CREATE TYPE appointment_status_enum AS ENUM ('BOOKED', 'CANCELLED');
    `);

    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        public_id UUID NOT NULL DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT uq_users_public_id UNIQUE (public_id)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE doctors (
        id SERIAL PRIMARY KEY,
        public_id UUID NOT NULL DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        specialization VARCHAR NOT NULL,
        experience INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT uq_doctors_public_id UNIQUE (public_id)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE appointments (
        id SERIAL PRIMARY KEY,
        public_id UUID NOT NULL DEFAULT uuid_generate_v4(),
        patient_id INTEGER NOT NULL,
        doctor_id INTEGER NOT NULL,
        reason VARCHAR NOT NULL,
        appointment_date TIMESTAMP NOT NULL,
        status appointment_status_enum NOT NULL DEFAULT 'BOOKED',
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT uq_appointments_public_id UNIQUE (public_id),
        CONSTRAINT fk_appointments_patient
          FOREIGN KEY (patient_id)
          REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_appointments_doctor
          FOREIGN KEY (doctor_id)
          REFERENCES doctors(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX uq_doctor_appointment_slot
      ON appointments (doctor_id, appointment_date)
      WHERE status = 'BOOKED';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS uq_doctor_appointment_slot;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS appointments;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS doctors;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS users;
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS appointment_status_enum;
    `);
  }
}
