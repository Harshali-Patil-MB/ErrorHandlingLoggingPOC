import { AppointmentStatus } from "../entity/appointment.entity";

export interface CreateAppointmentRequestDto {
  doctorPublicId: string;
  reason: string;
  appointmentDate: Date;
}

export interface DoctorSummaryDto {
  publicId: string;
  name: string;
  specialization: string;
  experience: number;
}

export interface AppointmentResponseDto {
  id: number;
  publicId: string;
  reason: string;
  appointmentDate: Date;
  status: AppointmentStatus;
  doctor: DoctorSummaryDto;
  createdAt: Date;
  updatedAt: Date;
}

