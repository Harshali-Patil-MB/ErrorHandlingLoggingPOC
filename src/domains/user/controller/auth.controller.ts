import { Request, Response } from "express";
import { Service } from "typedi";

import { AuthService } from "../service/auth.service";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { generateResponse } from "../../../common/utils/response.util";

@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public async register(req: Request, res: Response): Promise<Response> {
    const data = await this.authService.register(req.body);

    return generateResponse(res, {
      statusCode: HttpStatus.CREATED,
      message: "User registered successfully.",
      data,
    });
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const data = await this.authService.login(req.body);

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "Login successful.",
      data,
    });
  }

  public async me(req: Request, res: Response): Promise<Response> {
    const data = await this.authService.me(req.user!.id);

    return generateResponse(res, {
      statusCode: HttpStatus.OK,
      message: "User fetched successfully.",
      data,
    });
  }
}
