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

export interface AvailableSlotDto {
  value: string;
  label: string;
  status: "AVAILABLE" | "BOOKED";
}

export interface AvailableSlotsResponseDto {
  doctor: DoctorSummaryDto;
  date: string;
  slots: AvailableSlotDto[];
}
