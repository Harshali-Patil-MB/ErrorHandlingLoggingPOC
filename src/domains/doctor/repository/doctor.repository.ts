import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/data-source";
import { Doctor } from "../entity/doctor.entity";

@Service()
export class DoctorRepository {
  private readonly repository: Repository<Doctor>;

  constructor() {
    this.repository = AppDataSource.getRepository(Doctor);
  }

  public async create(data: Partial<Doctor>): Promise<Doctor> {
    const doctor = this.repository.create(data);
    return this.repository.save(doctor);
  }

  public async findAll(): Promise<Doctor[]> {
    return this.repository.find({
      order: {
        createdAt: "DESC",
      },
    });
  }

  public async findByPublicId(publicId: string): Promise<Doctor | null> {
    return this.repository.findOne({
      where: { publicId },
    });
  }

  public async findByNameAndSpecialization(
    name: string,
    specialization: string,
  ): Promise<Doctor | null> {
    return this.repository.findOne({
      where: { name, specialization },
    });
  }
}
