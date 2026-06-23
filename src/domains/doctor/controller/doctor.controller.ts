import { Request, Response } from "express";
import { Service } from "typedi";

import { HttpStatus } from "../../../common/constants/http-status.constants";
import { generateResponse } from "../../../common/utils/response.util";
import { DoctorService } from "../service/doctor.service";

@Service()
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  public async createDoctor(req: Request, res: Response): Promise<Response> {
    const data = await this.doctorService.createDoctor(req.body);

    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: "Doctor created successfully.",
      data,
    });
  }

  public async getAllDoctors(req: Request, res: Response): Promise<Response> {
    const data = await this.doctorService.getAllDoctors();

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Doctors fetched successfully.",
      data,
    });
  }

  public async getDoctorByPublicId(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const publicId = Array.isArray(req.params.publicId)
      ? req.params.publicId[0]
      : req.params.publicId;

    const data = await this.doctorService.getDoctorByPublicId(
      publicId,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Doctor fetched successfully.",
      data,
    });
  }

  public async getAvailableSlots(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const publicId = Array.isArray(req.params.publicId)
      ? req.params.publicId[0]
      : req.params.publicId;
    const date = typeof req.query.date === "string" ? req.query.date : "";

    const data = await this.doctorService.getAvailableSlots(publicId, date);

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Available slots fetched successfully.",
      data,
    });
  }
}
