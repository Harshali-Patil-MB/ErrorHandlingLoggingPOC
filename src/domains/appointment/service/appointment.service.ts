import { Service } from "typedi";

import { BadRequestException } from "../../../common/exceptions/bad-request.exception";
import { ConflictException } from "../../../common/exceptions/conflict.exception";
import { ForbiddenException } from "../../../common/exceptions/forbidden.exception";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";
import { LoggerService } from "../../../common/utils/logger.service";
import { UserRepository } from "../../user/repository/user.repository";
import { DoctorRepository } from "../../doctor/repository/doctor.repository";
import { DoctorSlotRepository } from "../../doctor/repository/doctor-slot.repository";
import { AppointmentStatus } from "../entity/appointment.entity";
import {
  AppointmentResponseDto,
  CreateAppointmentRequestDto,
} from "../dto/appointment.dto";
import { AppointmentRepository } from "../repository/appointment.repository";
import { QueryFailedError } from "typeorm";

@Service()
export class AppointmentService {
  constructor(
    private readonly repository: AppointmentRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly slotRepository: DoctorSlotRepository,
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  public async createAppointment(
    data: CreateAppointmentRequestDto,
    patientId: number,
  ): Promise<AppointmentResponseDto> {
    this.logger.info("Appointment creation started", {
      patientId,
      doctorPublicId: data.doctorPublicId,
    });

    if (
      !(data.appointmentDate instanceof Date) ||
      Number.isNaN(data.appointmentDate.getTime())
    ) {
      throw new BadRequestException("Invalid date");
    }

    if (data.appointmentDate.getTime() <= Date.now()) {
      this.logger.warn("Rejected past appointment date", {
        patientId,
        appointmentDate: data.appointmentDate,
      });
      throw new BadRequestException("Appointment date must be in the future");
    }

    if (
      data.appointmentDate.getMinutes() % 30 !== 0 ||
      data.appointmentDate.getSeconds() !== 0 ||
      data.appointmentDate.getMilliseconds() !== 0
    ) {
      this.logger.warn("Rejected non-slot appointment time", {
        patientId,
        appointmentDate: data.appointmentDate,
      });
      throw new BadRequestException(
        "Appointment time must be on a 30-minute slot",
      );
    }

    const patient = await this.userRepository.findById(patientId);

    if (!patient) {
      throw new NotFoundException("User not found");
    }

    const doctor = await this.doctorRepository.findByPublicId(
      data.doctorPublicId,
    );

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    const slot = await this.slotRepository.findSlotByDoctorAndDateTime(
      doctor.id,
      data.appointmentDate,
    );

    if (!slot) {
      this.logger.warn("Rejected unavailable appointment slot", {
        patientId,
        doctorId: doctor.id,
        appointmentDate: data.appointmentDate,
      });
      throw new BadRequestException("Appointment time is not available");
    }

    const bookedSlot = await this.repository.findBookedSlotByDoctorAndDate(
      doctor.id,
      data.appointmentDate,
    );

    if (bookedSlot) {
      this.logger.warn("Appointment slot already booked", {
        doctorId: doctor.id,
        appointmentDate: data.appointmentDate,
      });
      throw new ConflictException("Slot already booked");
    }

    let appointment;

    try {
      appointment = await this.repository.create({
        patient,
        doctor,
        reason: data.reason,
        appointmentDate: data.appointmentDate,
        status: AppointmentStatus.BOOKED,
      });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        typeof (error as { code?: string }).code === "string" &&
        (error as { code?: string }).code === "23505"
      ) {
        this.logger.warn("Appointment slot already booked", {
          doctorId: doctor.id,
          appointmentDate: data.appointmentDate,
        });
        throw new ConflictException("Slot already booked");
      }

      throw error;
    }

    this.logger.info("Appointment created successfully", {
      appointmentId: appointment.id,
      publicId: appointment.publicId,
      patientId,
      doctorId: doctor.id,
    });

    return this.mapToResponse(appointment);
  }

  public async getMyAppointments(
    patientId: number,
  ): Promise<AppointmentResponseDto[]> {
    this.logger.info("Fetching appointments for patient", { patientId });

    const appointments = await this.repository.findAllByPatientId(patientId);

    this.logger.info("Appointments fetched successfully", {
      patientId,
      count: appointments.length,
    });

    return appointments.map((appointment) => this.mapToResponse(appointment));
  }

  public async getAppointmentByPublicId(
    publicId: string,
    patientId: number,
  ): Promise<AppointmentResponseDto> {
    this.logger.info("Fetching appointment by publicId", {
      publicId,
      patientId,
    });

    const appointment = await this.repository.findByPublicId(publicId);

    if (!appointment) {
      this.logger.warn("Appointment not found", { publicId });
      throw new NotFoundException("Appointment not found");
    }

    if (appointment.patient.id !== patientId) {
      this.logger.warn("Attempt to access another patient's appointment", {
        publicId,
        patientId,
        ownerPatientId: appointment.patient.id,
      });
      throw new ForbiddenException("Not your appointment");
    }

    this.logger.info("Appointment fetched successfully", {
      appointmentId: appointment.id,
      publicId: appointment.publicId,
    });

    return this.mapToResponse(appointment);
  }

  public async cancelAppointment(
    publicId: string,
    patientId: number,
  ): Promise<AppointmentResponseDto> {
    this.logger.info("Cancelling appointment", { publicId, patientId });

    const appointment = await this.repository.findByPublicId(publicId);

    if (!appointment) {
      this.logger.warn("Appointment not found for cancellation", { publicId });
      throw new NotFoundException("Appointment not found");
    }

    if (appointment.patient.id !== patientId) {
      this.logger.warn("Attempt to cancel another patient's appointment", {
        publicId,
        patientId,
        ownerPatientId: appointment.patient.id,
      });
      throw new ForbiddenException("Not your appointment");
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new ConflictException("Appointment already cancelled");
    }

    appointment.status = AppointmentStatus.CANCELLED;

    const updatedAppointment = await this.repository.save(appointment);

    this.logger.info("Appointment cancelled successfully", {
      appointmentId: updatedAppointment.id,
      publicId: updatedAppointment.publicId,
    });

    return this.mapToResponse(updatedAppointment);
  }

  private mapToResponse(appointment: {
    id: number;
    publicId: string;
    reason: string;
    appointmentDate: Date;
    status: AppointmentStatus;
    doctor: {
      publicId: string;
      name: string;
      specialization: string;
      experience: number;
    };
    createdAt: Date;
    updatedAt: Date;
  }): AppointmentResponseDto {
    return {
      id: appointment.id,
      publicId: appointment.publicId,
      reason: appointment.reason,
      appointmentDate: appointment.appointmentDate,
      status: appointment.status,
      doctor: {
        publicId: appointment.doctor.publicId,
        name: appointment.doctor.name,
        specialization: appointment.doctor.specialization,
        experience: appointment.doctor.experience,
      },
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }
}
