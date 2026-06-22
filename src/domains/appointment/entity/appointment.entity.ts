import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
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
    type: "uuid",
    generated: "uuid",
    unique: true,
  })
  publicId!: string;

  @Column()
  reason!: string;

  @Column({
    type: "timestamp",
  })
  appointmentDate!: Date;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status!: AppointmentStatus;

  @ManyToOne(() => User, (user) => user.appointments)
  patient!: User;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor!: Doctor;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
