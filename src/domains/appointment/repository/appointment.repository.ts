import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/data-source";
import { Appointment, AppointmentStatus } from "../entity/appointment.entity";

@Service()
export class AppointmentRepository {
  private readonly repository: Repository<Appointment>;

  constructor() {
    this.repository = AppDataSource.getRepository(Appointment);
  }

  public async create(data: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.repository.create(data);
    return this.repository.save(appointment);
  }

  public async save(appointment: Appointment): Promise<Appointment> {
    return this.repository.save(appointment);
  }

  public async findAllByPatientId(patientId: number): Promise<Appointment[]> {
    return this.repository.find({
      where: {
        patient: { id: patientId },
      },
      relations: {
        doctor: true,
      },
      order: {
        appointmentDate: "DESC",
      },
    });
  }

  public async findByPublicId(
    publicId: string,
  ): Promise<Appointment | null> {
    return this.repository.findOne({
      where: {
        publicId,
      },
      relations: {
        doctor: true,
        patient: true,
      },
    });
  }

  public async findBookedSlotByDoctorAndDate(
    doctorId: number,
    appointmentDate: Date,
  ): Promise<Appointment | null> {
    return this.repository.findOne({
      where: {
        doctor: { id: doctorId },
        appointmentDate,
        status: AppointmentStatus.BOOKED,
      },
    });
  }

  public async findBookedSlotsByDoctorAndDateRange(
    doctorId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Appointment[]> {
    return this.repository
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.doctor", "doctor")
      .leftJoinAndSelect("appointment.patient", "patient")
      .where("doctor.id = :doctorId", { doctorId })
      .andWhere("appointment.appointmentDate >= :startDate", { startDate })
      .andWhere("appointment.appointmentDate < :endDate", { endDate })
      .andWhere("appointment.status = :status", {
        status: AppointmentStatus.BOOKED,
      })
      .orderBy("appointment.appointmentDate", "ASC")
      .getMany();
  }
}
