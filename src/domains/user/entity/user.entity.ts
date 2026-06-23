import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Appointment } from "../../appointment/entity/appointment.entity";

@Entity("users")
export class User {
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

  @Column({
    name: "email",
    unique: true,
  })
  email!: string;

  @Column({ name: "password" })
  password!: string;

  @Column({
    name: "role",
    type: "varchar",
    default: "PATIENT",
  })
  role!: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments!: Appointment[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
