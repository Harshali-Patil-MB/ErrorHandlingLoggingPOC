import { Service } from "typedi";

import { BadRequestException } from "../../../common/exceptions/bad-request.exception";
import { ConflictException } from "../../../common/exceptions/conflict.exception";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";
import { LoggerService } from "../../../common/utils/logger.service";
import {
    CreateDoctorRequestDto,
    DoctorResponseDto,
} from "../dto/doctor.dto";
import { DoctorRepository } from "../repository/doctor.repository";
import { DoctorSlotRepository } from "../repository/doctor-slot.repository";
import { AppointmentRepository } from "../../appointment/repository/appointment.repository";
import {
  AvailableSlotsResponseDto,
  AvailableSlotDto,
} from "../../appointment/dto/appointment.dto";

@Service()
export class DoctorService {
  constructor(
    private readonly repository: DoctorRepository,
    private readonly slotRepository: DoctorSlotRepository,
    private readonly appointmentRepository: AppointmentRepository,
    private readonly logger: LoggerService,
  ) {}

  public async createDoctor(
    data: CreateDoctorRequestDto,
  ): Promise<DoctorResponseDto> {
    this.logger.info("Doctor creation started", {
      name: data.name,
      specialization: data.specialization,
    });

    const existingDoctor = await this.repository.findByNameAndSpecialization(
      data.name,
      data.specialization,
    );

    if (existingDoctor) {
      this.logger.warn("Duplicate doctor creation attempt", {
        name: data.name,
        specialization: data.specialization,
      });
      throw new ConflictException("Doctor already exists");
    }

    const doctor = await this.repository.create({
      name: data.name,
      specialization: data.specialization,
      experience: data.experience,
    });

    this.logger.info("Doctor created successfully", {
      doctorId: doctor.id,
      publicId: doctor.publicId,
    });

    await this.slotRepository.generateSlotsForDoctor(doctor.id, 30);

    this.logger.info("Doctor slots generated successfully", {
      doctorId: doctor.id,
      publicId: doctor.publicId,
    });

    return this.mapToResponse(doctor);
  }

  public async getAllDoctors(): Promise<DoctorResponseDto[]> {
    this.logger.info("Fetching all doctors");

    const doctors = await this.repository.findAll();

    this.logger.info("Doctors fetched successfully", {
      count: doctors.length,
    });

    return doctors.map((doctor) => this.mapToResponse(doctor));
  }

  public async getDoctorByPublicId(publicId: string): Promise<DoctorResponseDto> {
    this.logger.info("Fetching doctor by publicId", { publicId });

    const doctor = await this.repository.findByPublicId(publicId);

    if (!doctor) {
      this.logger.warn("Doctor not found", { publicId });
      throw new NotFoundException("Doctor not found");
    }

    this.logger.info("Doctor fetched successfully", {
      doctorId: doctor.id,
      publicId: doctor.publicId,
    });

    return this.mapToResponse(doctor);
  }

  public async getAvailableSlots(
    publicId: string,
    date: string,
  ): Promise<AvailableSlotsResponseDto> {
    this.logger.info("Fetching available slots for doctor", {
      publicId,
      date,
    });

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException("Date must be provided as YYYY-MM-DD");
    }

    const doctor = await this.repository.findByPublicId(publicId);

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    const selectedDay = new Date(`${date}T00:00:00`);

    if (Number.isNaN(selectedDay.getTime())) {
      throw new BadRequestException("Invalid date");
    }

    const startOfDay = new Date(selectedDay);
    startOfDay.setHours(9, 0, 0, 0);

    const endOfDay = new Date(selectedDay);
    endOfDay.setHours(17, 0, 0, 0);

    const slots = await this.slotRepository.findSlotsByDoctorAndDateRange(
      doctor.id,
      startOfDay,
      endOfDay,
    );

    const bookedSlots =
      await this.appointmentRepository.findBookedSlotsByDoctorAndDateRange(
        doctor.id,
        startOfDay,
        endOfDay,
      );

    const bookedTimes = new Set(
      bookedSlots.map((appointment) => appointment.appointmentDate.getTime()),
    );

    const now = new Date();

    const availableSlots: AvailableSlotDto[] = slots
      .filter((slot) => new Date(slot.slotDateTime).getTime() > now.getTime())
      .map((slot) => {
        const slotDateTime = new Date(slot.slotDateTime);
        const slotTime = slotDateTime.getTime();

        return {
          value: slotDateTime.toISOString(),
          label: this.formatSlotLabel(slotDateTime),
          status: bookedTimes.has(slotTime) ? "BOOKED" : "AVAILABLE",
        };
      });

    this.logger.info("Available slots fetched successfully", {
      doctorId: doctor.id,
      publicId: doctor.publicId,
      date,
      count: availableSlots.length,
    });

    return {
      doctor: this.mapToResponse(doctor),
      date,
      slots: availableSlots,
    };
  }

  private mapToResponse(doctor: {
    id: number;
    publicId: string;
    name: string;
    specialization: string;
    experience: number;
    createdAt: Date;
    updatedAt: Date;
  }): DoctorResponseDto {
    return {
      id: doctor.id,
      publicId: doctor.publicId,
      name: doctor.name,
      specialization: doctor.specialization,
      experience: doctor.experience,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    };
  }

  private formatSlotLabel(slot: Date): string {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(slot);
  }
}
