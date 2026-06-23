import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/data-source";
import { DoctorSlot } from "../entity/doctor-slot.entity";

@Service()
export class DoctorSlotRepository {
  private readonly repository: Repository<DoctorSlot>;

  constructor() {
    this.repository = AppDataSource.getRepository(DoctorSlot);
  }

  public async generateSlotsForDoctor(
    doctorId: number,
    daysAhead: number = 30,
  ): Promise<void> {
    const sql = `
      INSERT INTO doctor_slots (doctor_id, slot_datetime)
      SELECT
        $1,
        (day_series::date + slot_times.slot_time)::timestamp
      FROM generate_series(
        current_date,
        current_date + ($2 - 1) * interval '1 day',
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
    `;

    await this.repository.query(sql, [doctorId, daysAhead]);
  }

  public async findSlotsByDoctorAndDateRange(
    doctorId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<DoctorSlot[]> {
    return this.repository
      .createQueryBuilder("slot")
      .leftJoinAndSelect("slot.doctor", "doctor")
      .where("doctor.id = :doctorId", { doctorId })
      .andWhere("slot.slotDateTime >= :startDate", { startDate })
      .andWhere("slot.slotDateTime < :endDate", { endDate })
      .orderBy("slot.slotDateTime", "ASC")
      .getMany();
  }

  public async findSlotByDoctorAndDateTime(
    doctorId: number,
    slotDateTime: Date,
  ): Promise<DoctorSlot | null> {
    return this.repository.findOne({
      where: {
        doctor: { id: doctorId },
        slotDateTime,
      },
      relations: {
        doctor: true,
      },
    });
  }
}
