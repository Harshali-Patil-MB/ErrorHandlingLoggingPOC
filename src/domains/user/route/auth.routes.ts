import { Router } from "express";
import { Service } from "typedi";

import { asyncHandler } from "../../../common/utils/async-handler";
import { validate } from "../../../common/middleware/validate.middleware";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { AuthController } from "../controller/auth.controller";
import { registerSchema, loginSchema } from "../validator/auth.validation";
@Service()
export class AuthRoutes {
  public router: Router;

  constructor(private readonly controller: AuthController) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.post(
      "/register",
      validate(registerSchema),
      asyncHandler(this.controller.register.bind(this.controller)),
    );

    this.router.post(
      "/login",
      validate(loginSchema),
      asyncHandler(this.controller.login.bind(this.controller)),
    );

    this.router.get(
      "/me",
      authenticate,
      asyncHandler(this.controller.me.bind(this.controller)),
    );
  }
}
