import { Request, Response } from "express";
import { Service } from "typedi";

import { HttpStatus } from "../../../common/constants/http-status.constants";
import { generateResponse } from "../../../common/utils/response.util";
import { AppointmentService } from "../service/appointment.service";

@Service()
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  public async createAppointment(req: Request, res: Response): Promise<Response> {
    const data = await this.appointmentService.createAppointment(
      req.body,
      req.user!.id,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: "Appointment created successfully.",
      data,
    });
  }

  public async getMyAppointments(req: Request, res: Response): Promise<Response> {
    const data = await this.appointmentService.getMyAppointments(req.user!.id);

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Appointments fetched successfully.",
      data,
    });
  }

  public async getAppointmentByPublicId(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const publicId = Array.isArray(req.params.publicId)
      ? req.params.publicId[0]
      : req.params.publicId;

    const data = await this.appointmentService.getAppointmentByPublicId(
      publicId,
      req.user!.id,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Appointment fetched successfully.",
      data,
    });
  }

  public async cancelAppointment(req: Request, res: Response): Promise<Response> {
    const publicId = Array.isArray(req.params.publicId)
      ? req.params.publicId[0]
      : req.params.publicId;

    const data = await this.appointmentService.cancelAppointment(
      publicId,
      req.user!.id,
    );

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Appointment cancelled successfully.",
      data,
    });
  }
}

