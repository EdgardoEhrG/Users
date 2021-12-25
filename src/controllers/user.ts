import { NextFunction, Request, Response } from "express";
import { Controller } from "../common/controller";
import { UserLoginDto } from "../dto/user-login";
import { UserRegisterDto } from "../dto/user-register";
import { HTTPError } from "../errors/http-error";
import { LoggerService } from "../logger";
import { ValidateMiddleware } from "../middleware/validation";
import { UserService } from "../services/user";
import { sign } from "jsonwebtoken";
import { ConfigService } from "../config/config.service";
import { AuthGuard } from "../common/auth.guard";

export class UserController extends Controller {
  private users;
  private config;

  constructor(
    logger: LoggerService,
    users: UserService,
    config: ConfigService
  ) {
    super(logger);
    this.config = config;
    this.users = users;
    this.bindRoutes([
      {
        path: "/register",
        method: "post",
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        path: "/login",
        method: "post",
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        path: "/info",
        method: "get",
        func: this.info,
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async login(
    { body }: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.users.validateUser(body);

    if (!result) {
      return next(new HTTPError(401, "Auth is failed", "login"));
    }

    const jwt = await this.signJWT(body.email, this.config.get("SECRET"));

    this.ok(res, { jwt });
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.users.createUser(body);

    if (!result) {
      return next(new HTTPError(422, "The user is exist"));
    }

    this.ok(res, { email: result.email, id: result.id });
  }

  async info(
    { user }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userInfo = await this.users.getUserInfo(user);
    this.ok(res, { email: userInfo?.email, id: userInfo?.id });
  }

  private signJWT(email: string, secret: string) {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        { algorithm: "HS256" },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token as string);
        }
      );
    });
  }
}
