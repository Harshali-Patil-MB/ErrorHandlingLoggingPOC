import { Router } from "express";
import { Service } from "typedi";

import { asyncHandler } from "../../../common/utils/async-handler";
import { validate } from "../../../common/middleware/validate.middleware";
import { DoctorController } from "../controller/doctor.controller";
import { createDoctorSchema } from "../validator/doctor.validation";

@Service()
export class DoctorRoutes {
  public router: Router;

  constructor(private readonly controller: DoctorController) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.post(
      "/",
      validate(createDoctorSchema),
      asyncHandler(this.controller.createDoctor.bind(this.controller)),
    );

    this.router.get(
      "/",
      asyncHandler(this.controller.getAllDoctors.bind(this.controller)),
    );

    this.router.get(
      "/:publicId",
      asyncHandler(this.controller.getDoctorByPublicId.bind(this.controller)),
    );

    this.router.get(
      "/:publicId/available-slots",
      asyncHandler(this.controller.getAvailableSlots.bind(this.controller)),
    );
  }
}
