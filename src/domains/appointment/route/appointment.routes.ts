import { Router } from "express";
import { Service } from "typedi";

import { asyncHandler } from "../../../common/utils/async-handler";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { validate } from "../../../common/middleware/validate.middleware";
import { AppointmentController } from "../controller/appointment.controller";
import { createAppointmentSchema } from "../validator/appointment.validation";

@Service()
export class AppointmentRoutes {
  public router: Router;

  constructor(private readonly controller: AppointmentController) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.post(
      "/",
      authenticate,
      validate(createAppointmentSchema),
      asyncHandler(this.controller.createAppointment.bind(this.controller)),
    );

    this.router.get(
      "/",
      authenticate,
      asyncHandler(this.controller.getMyAppointments.bind(this.controller)),
    );

    this.router.get(
      "/:publicId",
      authenticate,
      asyncHandler(this.controller.getAppointmentByPublicId.bind(this.controller)),
    );

    this.router.patch(
      "/:publicId/cancel",
      authenticate,
      asyncHandler(this.controller.cancelAppointment.bind(this.controller)),
    );
  }
}

