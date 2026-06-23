import { Service } from "typedi";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { UserRepository } from "../repository/user.repository";
import {
  RegisterRequestDto,
  RegisterResponseDto,
  LoginRequestDto,
  AuthResponseDto,
  UserResponseDto,
} from "../dto/auth.dto";

import { ROLES } from "../../../common/constants/roles.constants";
import { ConflictException } from "../../../common/exceptions/conflict.exception";
import { UnauthorizedException } from "../../../common/exceptions/unauthorized.exception";
import { NotFoundException } from "../../../common/exceptions/not-found.exception";
import { LoggerService } from "../../../common/utils/logger.service";

@Service()
export class AuthService {
  constructor(
    private readonly repository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  public async register(
    data: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    this.logger.info("User registration started", { email: data.email });

    const existingUser = await this.repository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2id,
    });

    const user = await this.repository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const responseUser: UserResponseDto = {
      id: user.id,
      publicId: user.publicId,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    this.logger.info("User registered successfully", {
      userId: user.id,
      publicId: user.publicId,
    });

    return {
      user: responseUser,
    };
  }

  public async login(data: LoginRequestDto): Promise<AuthResponseDto> {
    this.logger.info("Login attempt started", { email: data.email });

    const user = await this.repository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordValid = await argon2.verify(user.password, data.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        publicId: user.publicId,
        email: user.email,
        role: ROLES.PATIENT,
      },
      secret,
      {
        expiresIn: "1d",
      },
    );

    const responseUser: UserResponseDto = {
      id: user.id,
      publicId: user.publicId,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    this.logger.info("Login successful", {
      userId: user.id,
      publicId: user.publicId,
    });

    return {
      accessToken,
      user: responseUser,
    };
  }

  public async me(userId: number): Promise<UserResponseDto> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      id: user.id,
      publicId: user.publicId,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
