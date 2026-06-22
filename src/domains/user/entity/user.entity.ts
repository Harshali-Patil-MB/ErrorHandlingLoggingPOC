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
    type: "uuid",
    generated: "uuid",
    unique: true,
  })
  publicId!: string;

  @Column()
  name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments!: Appointment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
