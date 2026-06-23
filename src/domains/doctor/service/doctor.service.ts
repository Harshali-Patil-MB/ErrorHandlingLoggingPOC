import { Service } from "typedi";

import { ConflictException } from "../../../common/exceptions/conflict.exception";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";
import { LoggerService } from "../../../common/utils/logger.service";
import {
  CreateDoctorRequestDto,
  DoctorResponseDto,
} from "../dto/doctor.dto";
import { DoctorRepository } from "../repository/doctor.repository";

@Service()
export class DoctorService {
  constructor(
    private readonly repository: DoctorRepository,
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
}
