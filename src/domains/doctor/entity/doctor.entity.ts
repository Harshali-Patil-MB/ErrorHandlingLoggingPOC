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
    type: "uuid",
    generated: "uuid",
    unique: true,
  })
  publicId!: string;

  @Column()
  name!: string;

  @Column()
  specialization!: string;

  @Column()
  experience!: number;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments!: Appointment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
