import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "../../user/entity/user.entity";
import { Doctor } from "../../doctor/entity/doctor.entity";

export enum AppointmentStatus {
  BOOKED = "BOOKED",
  CANCELLED = "CANCELLED",
}

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "public_id",
    type: "uuid",
    generated: "uuid",
    unique: true,
  })
  publicId!: string;

  @Column({ name: "reason" })
  reason!: string;

  @Column({
    name: "appointment_date",
    type: "timestamp",
  })
  appointmentDate!: Date;

  @Column({
    name: "status",
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status!: AppointmentStatus;

  @JoinColumn({ name: "patient_id" })
  @ManyToOne(() => User, (user) => user.appointments)
  patient!: User;

  @JoinColumn({ name: "doctor_id" })
  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor!: Doctor;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
