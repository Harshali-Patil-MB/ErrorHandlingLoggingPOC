import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Doctor } from "./doctor.entity";

@Entity("doctor_slots")
export class DoctorSlot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "public_id",
    type: "uuid",
    generated: "uuid",
    unique: true,
  })
  publicId!: string;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: "doctor_id" })
  doctor!: Doctor;

  @Column({
    name: "slot_datetime",
    type: "timestamp",
  })
  slotDateTime!: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
