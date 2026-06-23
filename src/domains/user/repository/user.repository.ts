import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/data-source";
import { User } from "../entity/user.entity";

@Service()
export class UserRepository {
  private readonly repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  public async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  public async findById(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  public async findByPublicId(publicId: string): Promise<User | null> {
    return this.repository.findOne({
      where: { publicId },
    });
  }
}
