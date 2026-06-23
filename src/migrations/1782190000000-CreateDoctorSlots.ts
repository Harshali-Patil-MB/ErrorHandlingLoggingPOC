import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDoctorSlots1782190000000 implements MigrationInterface {
  name = "CreateDoctorSlots1782190000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE doctor_slots (
        id SERIAL PRIMARY KEY,
        public_id UUID NOT NULL DEFAULT uuid_generate_v4(),
        doctor_id INTEGER NOT NULL,
        slot_datetime TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT uq_doctor_slots_public_id UNIQUE (public_id),
        CONSTRAINT uq_doctor_slots_doctor_datetime UNIQUE (doctor_id, slot_datetime),
        CONSTRAINT fk_doctor_slots_doctor
          FOREIGN KEY (doctor_id)
          REFERENCES doctors(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      INSERT INTO doctor_slots (doctor_id, slot_datetime)
      SELECT
        d.id,
        (day_series::date + slot_times.slot_time)::timestamp
      FROM doctors d
      CROSS JOIN generate_series(
        current_date,
        current_date + interval '29 days',
        interval '1 day'
      ) AS day_series
      CROSS JOIN (
        VALUES
          ('09:00:00'::time),
          ('09:30:00'::time),
          ('10:00:00'::time),
          ('10:30:00'::time),
          ('11:00:00'::time),
          ('11:30:00'::time),
          ('12:00:00'::time),
          ('12:30:00'::time),
          ('13:00:00'::time),
          ('13:30:00'::time),
          ('14:00:00'::time),
          ('14:30:00'::time),
          ('15:00:00'::time),
          ('15:30:00'::time),
          ('16:00:00'::time),
          ('16:30:00'::time)
      ) AS slot_times(slot_time)
      ON CONFLICT (doctor_id, slot_datetime) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS doctor_slots;
    `);
  }
}
