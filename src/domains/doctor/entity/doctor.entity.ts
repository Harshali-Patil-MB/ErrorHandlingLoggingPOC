import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Appointment } from "../../appointment/entity/appointment.entity";

@Entity("doctors")
export class Doctor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "public_id",
    type: "uuid",
    generated: "uuid",
    unique: true,
  })
  publicId!: string;

  @Column({ name: "name" })
  name!: string;

  @Column({ name: "specialization" })
  specialization!: string;

  @Column({ name: "experience" })
  experience!: number;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments!: Appointment[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
